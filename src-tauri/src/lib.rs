#[cfg_attr(mobile, tauri::mobile_entry_point)]

pub fn run() {
    let port: u16 = 5173;

    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_localhost::Builder::new(port).build())
        .setup(move |app| Ok(()))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
