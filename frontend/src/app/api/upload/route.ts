import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// POST: Upload ảnh
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const bookSlug = formData.get('bookSlug') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    if (!bookSlug) {
      return NextResponse.json({ error: 'Book slug is required' }, { status: 400 });
    }

    // Đường dẫn thư mục lưu ảnh
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'books');

    // Tạo thư mục nếu chưa tồn tại
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedPaths: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Lấy extension từ file gốc
      const ext = file.name.split('.').pop() || 'jpg';
      
      // Tạo tên file: ten_sach.ext hoặc ten_sach_2.ext, ten_sach_3.ext
      const fileName = i === 0 ? `${bookSlug}.${ext}` : `${bookSlug}_${i + 1}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      // Ghi file
      await writeFile(filePath, buffer);
      
      // Đường dẫn public để hiển thị
      uploadedPaths.push(`/images/books/${fileName}`);
    }

    return NextResponse.json({ 
      success: true, 
      paths: uploadedPaths,
      message: `Uploaded ${uploadedPaths.length} file(s) successfully`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// DELETE: Xóa ảnh
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');

    if (!imagePath) {
      return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
    }

    // Chuyển đường dẫn public thành đường dẫn file system
    const filePath = path.join(process.cwd(), 'public', imagePath);

    if (existsSync(filePath)) {
      await unlink(filePath);
      return NextResponse.json({ success: true, message: 'File deleted successfully' });
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
