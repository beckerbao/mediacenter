"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Folder, 
  Film, 
  Upload,
  ChevronRight,
  Edit,
  Trash2
} from 'lucide-react';

// Hàm sinh dữ liệu mẫu
const generateLargeMediaData = () => {
  const folders = ['Du Lịch', 'Gia Đình', 'Công Việc', 'Sự Kiện'];
  const mediaTypes = ['image', 'video'];
  
  return folders.map((folderName, folderIndex) => ({
    id: `folder-${folderIndex}`,
    name: folderName,
    type: 'folder',
    children: Array.from({ length: 10 }, (_, index) => ({
      id: `${folderName.toLowerCase()}-${index}`,
      name: `${mediaTypes[index % 2 === 0 ? 0 : 1]}-${index}.${mediaTypes[index % 2 === 0 ? 0 : 1] === 'image' ? 'jpg' : 'mp4'}`,
      type: mediaTypes[index % 2 === 0 ? 0 : 1],
      url: `/api/placeholder/400/300?text=${folderName}+${index}`
    }))
  }));
};

const ContextMenuItem = ({ icon, label, onClick }) => (
  <div 
    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
  >
    {icon && <span className="mr-2">{icon}</span>}
    <span>{label}</span>
  </div>
);

const MediaManagement = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const fileInputRef = useRef(null);
  const contextMenuRef = useRef(null);

  useEffect(() => {
    setMediaFiles(generateLargeMediaData());
  }, []);

  const getCurrentFolder = useCallback(() => {
    return currentPath.reduce((folder, pathId) => {
      const foundFolder = folder.find(f => f.id === pathId);
      return foundFolder ? foundFolder.children : folder;
    }, mediaFiles);
  }, [currentPath, mediaFiles]);

  const handleRightClick = (event, item) => {
    event.preventDefault();
    // Điều chỉnh vị trí để menu không vượt quá màn hình
    const x = Math.min(event.clientX, window.innerWidth - 200); // 200px là chiều rộng ước tính của menu
    const y = Math.min(event.clientY, window.innerHeight - 150); // 150px là chiều cao ước tính của menu
    
    setContextMenu({ x, y, item });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu(null);
      }
    };
    
    // Thêm sự kiện click vào document để đóng menu
    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  const handleRename = () => {
    alert(`Đổi tên: ${contextMenu.item.name}`);
    setContextMenu(null);
  };

  const handleDelete = () => {
    alert(`Xóa: ${contextMenu.item.name}`);
    setContextMenu(null);
  };

  const handleOpen = () => {
    if (contextMenu.item.type === 'folder') {
      setCurrentPath(prev => [...prev, contextMenu.item.id]);
    } else {
      alert(`Xem trước: ${contextMenu.item.name}`);
    }
    setContextMenu(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 relative">
      <Card>
        <CardHeader>
          <CardTitle>Quản Lý Tệp</CardTitle>
        </CardHeader>
        <CardContent>
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
              onChange={() => alert('Tệp đã được tải lên!')}
            />
          </div>
          
          {/* Navigation breadcrumb */}
          {currentPath.length > 0 && (
            <div className="flex items-center mb-4 flex-wrap">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentPath([])}
                className="text-sm"
              >
                Trang chủ
              </Button>
              {currentPath.map((pathId, index) => {
                const folder = mediaFiles.find(f => f.id === pathId);
                const folderName = folder ? folder.name : 'Thư mục';
                return (
                  <div key={pathId} className="flex items-center">
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                      className="text-sm"
                    >
                      {folderName}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getCurrentFolder().map((item) => (
              <div 
                key={item.id} 
                className="relative border rounded-lg overflow-hidden cursor-pointer hover:bg-gray-50"
                onClick={() => item.type === 'folder' ? setCurrentPath(prev => [...prev, item.id]) : alert(`Xem trước: ${item.name}`)}
                onContextMenu={(e) => handleRightClick(e, item)}
              >
                {item.type === 'folder' ? (
                  <div className="flex flex-col items-center justify-center h-48 bg-gray-100">
                    <Folder className="w-16 h-16 text-blue-500" />
                    <span className="mt-2 text-sm font-medium">{item.name}</span>
                  </div>
                ) : item.type === 'image' ? (
                  <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                    <img 
                      src={item.url} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white p-2 text-sm truncate">
                      {item.name}
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                    <Film className="w-12 h-12 text-gray-400" />
                    <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white p-2 text-sm truncate">
                      {item.name}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Menu ngữ cảnh tùy chỉnh */}
      {contextMenu && (
        <div 
          ref={contextMenuRef}
          className="fixed bg-white shadow-lg rounded-md overflow-hidden z-50 w-48 border border-gray-200"
          style={{ 
            top: `${contextMenu.y}px`, 
            left: `${contextMenu.x}px`
          }}
        >
          <ContextMenuItem 
            icon={contextMenu.item.type === 'folder' ? <Folder className="w-4 h-4" /> : <Film className="w-4 h-4" />} 
            label={contextMenu.item.type === 'folder' ? 'Mở' : 'Xem trước'} 
            onClick={handleOpen} 
          />
          <ContextMenuItem 
            icon={<Edit className="w-4 h-4" />} 
            label="Đổi tên" 
            onClick={handleRename} 
          />
          <ContextMenuItem 
            icon={<Trash2 className="w-4 h-4" />} 
            label="Xóa" 
            onClick={handleDelete} 
          />
        </div>
      )}
    </div>
  );
};

export default MediaManagement;