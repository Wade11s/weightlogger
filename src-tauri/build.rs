fn main() {
    tauri_build::build();

    // 设置 Windows GUI 子系统，避免显示控制台窗口
    #[cfg(target_os = "windows")]
    {
        println!("cargo:rustc-link-arg-bin=weightlogger=/SUBSYSTEM:WINDOWS");
        println!("cargo:rustc-link-arg-bin=weightlogger=/ENTRYPOINT:mainCRTStartup");
    }
}
