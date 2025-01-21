#[cfg_attr(mobile, tauri::mobile_entry_point)]
// use tauri::{webview::WebviewWindowBuilder, WebviewUrl, Url};

pub fn run() {
    // let port: u16 = 5173;

    tauri::Builder::default()
        // .plugin(tauri_plugin_localhost::Builder::new(port).build())
        .setup(move |app| {
            // let url: Url = format!("http://localhost:{}", port).parse().unwrap();
            // WebviewWindowBuilder::new(app, "amain".to_string(), WebviewUrl::External(url))
            //   .title("Localhost")
            //   .build()?;
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
