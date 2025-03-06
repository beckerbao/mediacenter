"use client"; // Thêm dòng này lên đầu

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Folder, 
  Film, 
  Trash2, 
  Upload,
  ChevronRight,
  MoreVertical,
  Edit,
  Search 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Sinh dữ liệu mẫu với số lượng lớn
const generateLargeMediaData = () => {
  const folders = ['Du Lịch', 'Gia Đình', 'Công Việc', 'Sự Kiện'];
  const mediaTypes = ['image', 'video'];
  
  return folders.map((folderName, folderIndex) => ({
    id: `folder-${folderIndex}`,
    name: folderName,
    type: 'folder',
    children: Array.from({ length: 200 }, (_, index) => ({
      id: `${folderName.toLowerCase()}-${index}`,
      name: `${mediaTypes[index % 2 === 0 ? 0 : 1]}-${index}.${mediaTypes[index % 2 === 0 ? 0 : 1] === 'image' ? 'jpg' : 'mp4'}`,
      type: mediaTypes[index % 2 === 0 ? 0 : 1],
      url: `/api/placeholder/400/300?text=${folderName}+${index}`
    }))
  }));
};

const MediaManagement = () => {
  // Sinh dữ liệu lớn
  const [mediaFiles, setMediaFiles] = useState(generateLargeMediaData());
  const [currentPath, setCurrentPath] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  const gridRef = useRef(null);

  // Lấy folder hiện tại
  const getCurrentFolder = useCallback(() => {
    return currentPath.reduce((folder, pathId) => {
      const foundFolder = folder.find(f => f.id === pathId);
      return foundFolder ? foundFolder.children : folder;
    }, mediaFiles);
  }, [currentPath, mediaFiles]);

  // Lọc kết quả theo tìm kiếm
  const filteredItems = getCurrentFolder().filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Chuyển đến thư mục con
  const handleFolderOpen = useCallback((folderId) => {
    setCurrentPath(prev => [...prev, folderId]);
  }, []);

  // Quay lại thư mục trước đó
  const handleBackNavigation = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  // Xử lý tải lên file
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert(`Tệp "${file.name}" đã được tải lên thành công!`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Quản Lý Tệp Phương Tiện</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Breadcrumb Navigation */}
          <div className="mb-4 flex items-center space-x-2">
            <Button variant="outline" onClick={() => setCurrentPath([])}>
              Root
            </Button>
            {currentPath.map((folderId, index) => (
              <React.Fragment key={folderId}>
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <Button 
                  variant="outline" 
                  onClick={() => handleBackNavigation(index)}
                >
                  {folderId.replace('folder-', '')}
                </Button>
              </React.Fragment>
            ))}
          </div>

          {/* Thanh tìm kiếm và tải lên */}
          <div className="flex mb-4 space-x-2">
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={() => fileInputRef.current.click()}>
              <Upload className="w-5 h-5" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          {/* Hiển thị tệp */}
          <div ref={gridRef} className="grid grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="relative border rounded-lg overflow-hidden cursor-pointer"
                onClick={() => item.type === 'folder' ? handleFolderOpen(item.id) : alert(`Xem trước: ${item.name}`)}
              >
                {item.type === 'folder' ? (
                  <div className="flex flex-col items-center justify-center h-48 bg-gray-100">
                    <Folder className="w-16 h-16 text-blue-500" />
                    <span className="mt-2 text-sm">{item.name}</span>
                  </div>
                ) : (
                  <div className="relative">
                    <div 
                      className="w-full h-48 bg-gray-200 flex items-center justify-center"
                      style={{
                        backgroundImage: `url(${item.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <Film className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <span className="text-sm truncate">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaManagement;
