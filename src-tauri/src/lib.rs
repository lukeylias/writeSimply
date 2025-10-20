// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::fs;
use std::fs::File;
use std::io::{Read};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use std::process::Command;
use std::sync::Mutex;

#[derive(Serialize, Deserialize)]
pub struct WritingFile {
    pub name: String,
    pub text: String,
    pub font: String,
    pub font_size: u32,
    pub theme: String,
}

#[tauri::command]
fn get_user_folder(app_handle: AppHandle) -> Result<PathBuf, String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let user_folder = app_dir.join("user_data");
    fs::create_dir_all(&user_folder).map_err(|e| e.to_string())?;
    Ok(user_folder)
}

#[tauri::command]
fn save_file(app_handle: AppHandle, file: WritingFile) -> Result<String, String> {
    let user_folder = get_user_folder(app_handle)?;
    let file_path = user_folder.join(format!("{}.json", file.name));

    let serialized = serde_json::to_string(&file).map_err(|e| e.to_string())?;
    fs::write(&file_path, serialized).map_err(|e| e.to_string())?;

    Ok(format!("File '{}' saved successfully!", file.name))
}

#[tauri::command]
fn load_file(app_handle: AppHandle, name: String) -> Result<WritingFile, String> {
    let user_folder = get_user_folder(app_handle)?;
    let file_path = user_folder.join(format!("{}.json", name));

    if !file_path.exists() {
        return Err("File not found".into());
    }

    let mut file = File::open(file_path).map_err(|e| e.to_string())?;
    let mut contents = String::new();
    file.read_to_string(&mut contents).map_err(|e| e.to_string())?;

    let writing_file: WritingFile = serde_json::from_str(&contents).map_err(|e| e.to_string())?;
    Ok(writing_file)
}

#[tauri::command]
fn list_files(app_handle: AppHandle) -> Result<Vec<String>, String> {
    let user_folder = get_user_folder(app_handle)?;
    let mut file_names = Vec::new();

    for entry in fs::read_dir(user_folder).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        if let Some(name) = entry.path().file_stem() {
            file_names.push(name.to_string_lossy().to_string());
        }
    }

    Ok(file_names)
}

#[tauri::command]
fn delete_file(app_handle: AppHandle, name: String) -> Result<String, String> {
    let user_folder = get_user_folder(app_handle)?;
    let file_path = user_folder.join(format!("{}.json", name));

    if file_path.exists() {
        fs::remove_file(file_path).map_err(|e| e.to_string())?;
        Ok(format!("File '{}' deleted successfully!", name))
    } else {
        Err("File not found".into())
    }
}

struct AudioState {
    current_process: Option<std::process::Child>,
    current_song_path: Option<String>,
}

impl Default for AudioState {
    fn default() -> Self {
        Self { 
            current_process: None,
            current_song_path: None,
        }
    }
}

#[tauri::command]
fn play_audio(path: String, state: tauri::State<Mutex<AudioState>>) -> Result<(), String> {
    let mut audio_state = state.lock().map_err(|e| e.to_string())?;
    
    // Stop any currently playing audio
    if let Some(mut process) = audio_state.current_process.take() {
        let _ = process.kill();
    }
    
    // Play the new audio file using the system's native player
    #[cfg(target_os = "linux")]
    let result = Command::new("ffplay")
        .args(&["-nodisp", "-autoexit", &path])
        .spawn();
    
    #[cfg(target_os = "macos")]
    let result = Command::new("afplay")
        .arg(&path)
        .spawn();
    
    #[cfg(target_os = "windows")]
    let result = Command::new("powershell")
        .args(&["-c", &format!("(New-Object Media.SoundPlayer '{}').PlaySync();", path)])
        .spawn();
    
    match result {
        Ok(process) => {
            audio_state.current_process = Some(process);
            audio_state.current_song_path = Some(path);
            Ok(())
        }
        Err(e) => Err(format!("Failed to play audio: {}", e)),
    }
}

// Add a new command to check if audio is still playing
#[tauri::command]
fn is_audio_playing(state: tauri::State<Mutex<AudioState>>) -> Result<bool, String> {
    let mut audio_state = state.lock().map_err(|e| e.to_string())?;
    
    if let Some(process) = audio_state.current_process.as_mut() {
        // Check if the process is still running
        match process.try_wait() {
            Ok(Some(_)) => Ok(false), // Process has finished
            Ok(None) => Ok(true),     // Process is still running
            Err(_) => Ok(false),      // Error checking process
        }
    } else {
        Ok(false) // No process running
    }
}

#[tauri::command]
fn stop_audio(state: tauri::State<Mutex<AudioState>>) -> Result<(), String> {
    let mut audio_state = state.lock().map_err(|e| e.to_string())?;
    if let Some(mut process) = audio_state.current_process.take() {
        let _ = process.kill();
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init()) 
        .plugin(tauri_plugin_fs::init()) 
        .manage(Mutex::new(AudioState::default()))
        .invoke_handler(tauri::generate_handler![
            get_user_folder,
            save_file,
            load_file,
            list_files,
            delete_file,
            play_audio,
            stop_audio,
            is_audio_playing
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}