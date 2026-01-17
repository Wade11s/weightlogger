use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

// Data models

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WeightRecord {
    pub id: String,
    pub date: String,        // ISO 8601 date string
    pub weight: f64,         // kg
    #[serde(skip_serializing_if = "Option::is_none")]
    pub note: Option<String>,
    pub created_at: String,  // timestamp
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserProfile {
    pub height: f64,         // cm
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gender: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Goal {
    pub target_weight: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub target_date: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AppData {
    pub records: Vec<WeightRecord>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub profile: Option<UserProfile>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub goal: Option<Goal>,
    pub version: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ImportResult {
    pub success: i32,
    pub failed: i32,
    pub skipped: i32,
    pub errors: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ConflictResolution {
    pub on_conflict: String, // "overwrite", "keep", "skip"
}

// Get data directory path
fn get_data_dir() -> Result<PathBuf, String> {
    let home_dir = dirs::home_dir().ok_or("Failed to get home directory")?;
    let app_dir = home_dir.join(".weightlogger");

    // Create directory if it doesn't exist
    if !app_dir.exists() {
        fs::create_dir_all(&app_dir)
            .map_err(|e| format!("Failed to create data directory: {}", e))?;
    }

    Ok(app_dir)
}

// Get data file path
fn get_data_file_path() -> Result<PathBuf, String> {
    let data_dir = get_data_dir()?;
    Ok(data_dir.join("data.json"))
}

// Load app data from file
fn load_app_data() -> Result<AppData, String> {
    let data_path = get_data_file_path()?;

    if !data_path.exists() {
        // Return empty app data if file doesn't exist
        return Ok(AppData {
            records: vec![],
            profile: None,
            goal: None,
            version: 1,
        });
    }

    let content = fs::read_to_string(&data_path)
        .map_err(|e| format!("Failed to read data file: {}", e))?;

    serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse data file: {}", e))
}

// Save app data to file
fn save_app_data(data: &AppData) -> Result<(), String> {
    let data_path = get_data_file_path()?;

    let content = serde_json::to_string_pretty(data)
        .map_err(|e| format!("Failed to serialize data: {}", e))?;

    fs::write(&data_path, content)
        .map_err(|e| format!("Failed to write data file: {}", e))?;

    Ok(())
}

// Tauri Commands

#[tauri::command]
async fn get_records() -> Result<Vec<WeightRecord>, String> {
    let data = load_app_data()?;
    Ok(data.records)
}

#[tauri::command]
async fn get_profile() -> Result<Option<UserProfile>, String> {
    let data = load_app_data()?;
    Ok(data.profile)
}

#[tauri::command]
async fn get_goal() -> Result<Option<Goal>, String> {
    let data = load_app_data()?;
    Ok(data.goal)
}

#[tauri::command]
async fn save_record(record: WeightRecord) -> Result<(), String> {
    let mut data = load_app_data()?;

    // Check if record with same date exists, update it if so
    if let Some(existing) = data.records.iter().position(|r| r.date == record.date) {
        data.records[existing] = record;
    } else {
        data.records.push(record);
    }

    // Sort records by date (newest first)
    data.records.sort_by(|a, b| b.date.cmp(&a.date));

    save_app_data(&data)?;
    Ok(())
}

#[tauri::command]
async fn delete_record(id: String) -> Result<(), String> {
    let mut data = load_app_data()?;
    data.records.retain(|r| r.id != id);
    save_app_data(&data)?;
    Ok(())
}

#[tauri::command]
async fn update_profile(profile: UserProfile) -> Result<(), String> {
    let mut data = load_app_data()?;
    data.profile = Some(profile);
    save_app_data(&data)?;
    Ok(())
}

#[tauri::command]
async fn update_goal(goal: Goal) -> Result<(), String> {
    let mut data = load_app_data()?;
    data.goal = Some(goal);
    save_app_data(&data)?;
    Ok(())
}

#[tauri::command]
async fn export_data(format: String, path: String) -> Result<(), String> {
    let data = load_app_data()?;

    let content = if format == "json" {
        serde_json::to_string_pretty(&data.records)
            .map_err(|e| format!("Failed to serialize JSON: {}", e))?
    } else if format == "csv" {
        let mut csv = String::from("Date,Weight,Note\n");
        for record in &data.records {
            csv.push_str(&format!(
                "{},{},{}\n",
                record.date,
                record.weight,
                record.note.as_ref().unwrap_or(&String::new())
            ));
        }
        csv
    } else {
        return Err("Unsupported format".to_string());
    };

    fs::write(&path, content)
        .map_err(|e| format!("Failed to write export file: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn import_data_json(path: String, resolution: ConflictResolution) -> Result<ImportResult, String> {
    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    // Parse the JSON - it could be an array of records or a full AppData structure
    let imported_records: Vec<WeightRecord> = if let Ok(app_data) = serde_json::from_str::<AppData>(&content) {
        app_data.records
    } else if let Ok(records) = serde_json::from_str::<Vec<WeightRecord>>(&content) {
        records
    } else {
        return Err("Invalid JSON format".to_string());
    };

    let mut result = ImportResult {
        success: 0,
        failed: 0,
        skipped: 0,
        errors: Vec::new(),
    };

    let mut data = load_app_data()?;
    let mut new_records = Vec::new();

    for record in imported_records {
        // Validate record
        if record.weight < 20.0 || record.weight > 300.0 {
            result.failed += 1;
            result.errors.push(format!("Invalid weight value: {} on {}", record.weight, record.date));
            continue;
        }

        // Check for date conflicts
        if let Some(existing_index) = data.records.iter().position(|r| r.date == record.date) {
            match resolution.on_conflict.as_str() {
                "overwrite" => {
                    data.records[existing_index] = record.clone();
                    result.success += 1;
                }
                "skip" => {
                    result.skipped += 1;
                }
                "keep" => {
                    // Add the imported record alongside the existing one
                    new_records.push(record);
                    result.success += 1;
                }
                _ => {
                    result.skipped += 1;
                }
            }
        } else {
            new_records.push(record);
            result.success += 1;
        }
    }

    // Add all new records
    data.records.extend(new_records);

    // Sort by date (newest first)
    data.records.sort_by(|a, b| b.date.cmp(&a.date));

    save_app_data(&data)?;
    Ok(result)
}

#[tauri::command]
async fn import_data_csv(path: String, resolution: ConflictResolution) -> Result<ImportResult, String> {
    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    let mut result = ImportResult {
        success: 0,
        failed: 0,
        skipped: 0,
        errors: Vec::new(),
    };

    let mut data = load_app_data()?;
    let mut new_records = Vec::new();

    let lines: Vec<&str> = content.lines().collect();

    // Skip header if present
    let start_index = if lines.len() > 0 && lines[0].to_lowercase().contains("date") {
        1
    } else {
        0
    };

    for (line_num, line) in lines.iter().enumerate().skip(start_index) {
        let parts: Vec<&str> = line.split(',').collect();

        if parts.len() < 2 {
            result.failed += 1;
            result.errors.push(format!("Line {}: Invalid format", line_num + 1));
            continue;
        }

        let date = parts[0].trim().to_string();
        let weight: f64 = match parts[1].trim().parse() {
            Ok(w) => w,
            Err(_) => {
                result.failed += 1;
                result.errors.push(format!("Line {}: Invalid weight value", line_num + 1));
                continue;
            }
        };

        // Validate weight
        if weight < 20.0 || weight > 300.0 {
            result.failed += 1;
            result.errors.push(format!("Line {}: Weight out of range", line_num + 1));
            continue;
        }

        let note = if parts.len() > 2 && !parts[2].trim().is_empty() {
            Some(parts[2].trim().to_string())
        } else {
            None
        };

        let record = WeightRecord {
            id: uuid::Uuid::new_v4().to_string(),
            date,
            weight,
            note,
            created_at: chrono::Utc::now().to_rfc3339(),
        };

        // Check for date conflicts
        if let Some(existing_index) = data.records.iter().position(|r| r.date == record.date) {
            match resolution.on_conflict.as_str() {
                "overwrite" => {
                    data.records[existing_index] = record.clone();
                    result.success += 1;
                }
                "skip" => {
                    result.skipped += 1;
                }
                "keep" => {
                    new_records.push(record);
                    result.success += 1;
                }
                _ => {
                    result.skipped += 1;
                }
            }
        } else {
            new_records.push(record);
            result.success += 1;
        }
    }

    // Add all new records
    data.records.extend(new_records);

    // Sort by date (newest first)
    data.records.sort_by(|a, b| b.date.cmp(&a.date));

    save_app_data(&data)?;
    Ok(result)
}

#[tauri::command]
async fn create_backup(path: String) -> Result<(), String> {
    let data = load_app_data()?;

    let content = serde_json::to_string_pretty(&data)
        .map_err(|e| format!("Failed to serialize data: {}", e))?;

    fs::write(&path, content)
        .map_err(|e| format!("Failed to write backup file: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn restore_backup(path: String) -> Result<(), String> {
    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read backup file: {}", e))?;

    let data: AppData = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse backup file: {}", e))?;

    save_app_data(&data)?;
    Ok(())
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_records,
            get_profile,
            get_goal,
            save_record,
            delete_record,
            update_profile,
            update_goal,
            export_data,
            import_data_json,
            import_data_csv,
            create_backup,
            restore_backup,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
