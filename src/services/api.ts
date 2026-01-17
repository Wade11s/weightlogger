import { invoke } from '@tauri-apps/api/core';
import type { WeightRecord, UserProfile, Goal, ExportFormat, ImportStrategy, ImportResult } from '../types';

export const api = {
  // Data reading
  async getRecords(): Promise<WeightRecord[]> {
    return await invoke<WeightRecord[]>('get_records');
  },

  async getProfile(): Promise<UserProfile | null> {
    return await invoke<UserProfile | null>('get_profile');
  },

  async getGoal(): Promise<Goal | null> {
    return await invoke<Goal | null>('get_goal');
  },

  // Data writing
  async saveRecord(record: WeightRecord): Promise<void> {
    await invoke('save_record', { record });
  },

  async deleteRecord(id: string): Promise<void> {
    await invoke('delete_record', { id });
  },

  async updateProfile(profile: UserProfile): Promise<void> {
    await invoke('update_profile', { profile });
  },

  async updateGoal(goal: Goal): Promise<void> {
    await invoke('update_goal', { goal });
  },

  // Import/Export
  async exportData(format: ExportFormat, path: string): Promise<void> {
    await invoke('export_data', { format, path });
  },

  async importDataJson(path: string, resolution: ImportStrategy): Promise<ImportResult> {
    return await invoke<ImportResult>('import_data_json', { path, resolution });
  },

  async importDataCsv(path: string, resolution: ImportStrategy): Promise<ImportResult> {
    return await invoke<ImportResult>('import_data_csv', { path, resolution });
  },

  async createBackup(path: string): Promise<void> {
    await invoke('create_backup', { path });
  },

  async restoreBackup(path: string): Promise<void> {
    await invoke('restore_backup', { path });
  },
};
