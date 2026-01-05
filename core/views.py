import os
from django.conf import settings
from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def about(request):
    return render(request, 'about.html')

def gallery(request):
    img_folder = os.path.join(settings.BASE_DIR, 'core', 'static', 'images')
    
    # 1. DAFTAR FILE YANG DIKECUALIKAN
    # Tulis nama file foto profil atau aset lain yang TIDAK ingin dimunculkan di galeri
    exclude_files = ['profile.jpg', 'bg-hero.jpg', 'logo.png'] 
    
    # 2. KONFIGURASI MANUAL
    metadata_gambar = {
        'foto1.jpg': {
            'title': 'Acara Sertijab 2022',
            'category': 'Organisasi',
            'description': 'Acara Serah Terima Jabatan Pengurus Pramuka Masa Jabatan 2022 - 2025.'
        },
        'foto2.webp': {
            'title': 'PTB 2023',
            'category': 'Organisasi',
            'description': 'Persiapan acara Pelantikan Tamu Bantara 2024.'
        },
        'foto3.webp': {
            'title': 'Kegiatan PTB 2023',
            'category': 'Organisasi',
            'description': 'Kegiatan Pos Pos Untuk melatih Mental dan Fisik Anggota Pramuka.'
        },
        'foto4.jpg': {
            'title': 'Acara Saka Wira Kartika',
            'category': 'Organisasi',
            'description': 'Acara pembukaan Saka Wira Kartika 2023'
        },
        'foto5.jpg': {
            'title': 'Pelantikan Pramuka Penegak Laksana Tahun 2024',
            'category': 'Organisasi',
            'description': 'Acara pembukaan Pelantikan T3 Pramuka Penegak Laksana 2024'
        },
        'foto6.jpg': {
            'title': 'LKBB 2023',
            'category': 'Organisasi',
            'description': 'Kompetisi LKBB 17 Agustus 2023 Kota Padangsidimpuan.'
        },
    }

    data_gambar = []

    if os.path.exists(img_folder):
        list_file = os.listdir(img_folder)
        
        for nama_file in list_file:
            # 3. CEK PENGECUALIAN (FILTER)
            # Jika nama file ada di daftar 'exclude_files', lewati (jangan proses)
            if nama_file in exclude_files:
                continue

            if nama_file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                
                # Siapkan Nilai Default (Otomatis)
                judul = nama_file.split('.')[0].replace('_', ' ').replace('-', ' ').title()
                kategori = 'Dokumentasi'
                deskripsi = '' 

                # Cek apakah ada data manual di 'metadata_gambar'
                if nama_file in metadata_gambar:
                    info = metadata_gambar[nama_file]
                    judul = info.get('title', judul)
                    kategori = info.get('category', kategori)
                    deskripsi = info.get('description', deskripsi)

                data_gambar.append({
                    'file': nama_file,
                    'title': judul,
                    'category': kategori,
                    'description': deskripsi 
                })
    else:
        print("Folder gambar tidak ditemukan:", img_folder)

    context = {
        'title': 'Gallery',
        'active_page': 'gallery',
        'images': data_gambar 
    }
    return render(request, 'gallery.html', context)

def contact(request):
    return render(request, 'contact.html')