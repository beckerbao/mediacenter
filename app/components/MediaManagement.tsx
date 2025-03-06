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
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

// Hàm sinh dữ liệu mẫu với cấu trúc folder lồng nhau 3 cấp
const generateNestedMediaData = () => {
  const topLevelFolders = ['Du Lịch', 'Gia Đình', 'Công Việc', 'Sự Kiện', 'Tài Liệu'];
  const secondLevelFolders = {
    'Du Lịch': ['Trong Nước', 'Nước Ngoài', 'Biển', 'Núi'],
    'Gia Đình': ['Sinh Nhật', 'Kỷ Niệm', 'Cuối Tuần', 'Lễ Tết'],
    'Công Việc': ['Dự Án A', 'Dự Án B', 'Họp', 'Thuyết Trình'],
    'Sự Kiện': ['Hội Nghị', 'Tiệc', 'Workshop', 'Triển Lãm'],
    'Tài Liệu': ['Tài Chính', 'Pháp Lý', 'Kỹ Thuật', 'Marketing']
  };
  
  const thirdLevelFolders = {
    'Trong Nước': ['Miền Bắc', 'Miền Trung', 'Miền Nam'],
    'Nước Ngoài': ['Châu Á', 'Châu Âu', 'Châu Mỹ'],
    'Sinh Nhật': ['2023', '2024', '2025'],
    'Dự Án A': ['Giai Đoạn 1', 'Giai Đoạn 2', 'Báo Cáo'],
    'Dự Án B': ['Kế Hoạch', 'Triển Khai', 'Đánh Giá'],
    'Hội Nghị': ['Q1/2024', 'Q2/2024', 'Q3/2024'],
    'Tiệc': ['Công Ty', 'Cá Nhân', 'Đối Tác'],
    'Tài Chính': ['Ngân Sách', 'Báo Cáo', 'Kế Hoạch'],
    'Pháp Lý': ['Hợp Đồng', 'Giấy Phép', 'Quy Định'],
    'Marketing': ['Chiến Dịch', 'Nội Dung', 'Phân Tích']
  };
  
  const mediaTypes = ['image', 'video', 'document'];
  
  // Hàm tạo tệp media ngẫu nhiên
  const generateMediaFiles = (prefix, count) => {
    return Array.from({ length: count }, (_, index) => {
      const typeIndex = Math.floor(Math.random() * 3);
      const type = mediaTypes[typeIndex];
      const extension = type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'pdf';
      
      return {
        id: `${prefix.toLowerCase().replace(/\s+/g, '-')}-file-${index}`,
        name: `${type}-${index}.${extension}`,
        type: type,
        url: `/api/placeholder/400/300?text=${prefix}+${index}`,
        size: `${Math.floor(Math.random() * 10) + 1} MB`,
        dateCreated: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
      };
    });
  };
  
  // Tạo cấu trúc dữ liệu
  return topLevelFolders.map((folderName, folderIndex) => {
    // Tạo các folder cấp 1
    return {
      id: `folder-level1-${folderIndex}`,
      name: folderName,
      type: 'folder',
      level: 1,
      dateCreated: new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000)).toISOString(),
      children: [
        // Thêm một số tệp trực tiếp ở cấp 1
        ...generateMediaFiles(folderName, 3),
        
        // Tạo các folder cấp 2
        ...secondLevelFolders[folderName].map((subFolderName, subIndex) => {
          return {
            id: `${folderName.toLowerCase().replace(/\s+/g, '-')}-subfolder-${subIndex}`,
            name: subFolderName,
            type: 'folder',
            level: 2,
            dateCreated: new Date(Date.now() - Math.floor(Math.random() * 45 * 24 * 60 * 60 * 1000)).toISOString(),
            children: [
              // Thêm một số tệp ở cấp 2
              ...generateMediaFiles(`${folderName}-${subFolderName}`, 4),
              
              // Tạo các folder cấp 3 (nếu có trong danh sách)
              ...(thirdLevelFolders[subFolderName] 
                ? thirdLevelFolders[subFolderName].map((thirdFolderName, thirdIndex) => {
                    return {
                      id: `${subFolderName.toLowerCase().replace(/\s+/g, '-')}-thirdfolder-${thirdIndex}`,
                      name: thirdFolderName,
                      type: 'folder',
                      level: 3,
                      dateCreated: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
                      children: generateMediaFiles(`${subFolderName}-${thirdFolderName}`, 5)
                    };
                  })
                : [])
            ]
          };
        })
      ]
    };
  });
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

// Hàm để lấy icon cho từng loại tệp
const getFileIcon = (fileType, size = 12) => {
  switch(fileType) {
    case 'video':
      return <Film className={`w-${size} h-${size} text-blue-500`} />;
    case 'image':
      return <ImageIcon className={`w-${size} h-${size} text-green-500`} />;
    case 'document':
      return <div className={`w-${size} h-${size} flex items-center justify-center bg-gray-200 text-gray-700 font-bold`}>PDF</div>;
    default:
      return null;
  }
};

// Format date để hiển thị
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const MediaManagement = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef(null);
  const contextMenuRef = useRef(null);

  useEffect(() => {
    setMediaFiles(generateNestedMediaData());
  }, []);

  // Lấy folder hiện tại dựa trên đường dẫn
  const getCurrentFolder = useCallback(() => {
    if (currentPath.length === 0) return mediaFiles;
    
    let current = [...mediaFiles];
    let pathNames = [];
    
    for (const pathId of currentPath) {
      // Tìm kiếm trong mảng hiện tại
      let found = false;
      for (const item of current) {
        if (item.id === pathId && item.type === 'folder') {
          current = item.children;
          pathNames.push(item.name);
          found = true;
          break;
        }
      }
      if (!found) {
        console.error(`Không tìm thấy folder với id: ${pathId}`);
        return [];
      }
    }
    
    return current;
  }, [currentPath, mediaFiles]);

  // Lấy tên path hiện tại
  const getCurrentPathNames = useCallback(() => {
    if (currentPath.length === 0) return [];
    
    let current = [...mediaFiles];
    let pathNames = [];
    
    for (const pathId of currentPath) {
      // Tìm kiếm trong mảng hiện tại
      let found = false;
      for (const item of current) {
        if (item.id === pathId && item.type === 'folder') {
          current = item.children;
          pathNames.push({ id: item.id, name: item.name });
          found = true;
          break;
        }
      }
      if (!found) {
        console.error(`Không tìm thấy folder với id: ${pathId}`);
      }
    }
    
    return pathNames;
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

  // Lọc tệp khi tìm kiếm
  const filteredFiles = getCurrentFolder().filter(item => 
    searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              className="flex-grow"
            />
            <Button onClick={() => fileInputRef.current.click()}>
              <Upload className="w-5 h-5 mr-2" /> Tải lên
            </Button>
            <Button 
              variant={showDetails ? "secondary" : "outline"} 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Chế độ lưới" : "Chế độ chi tiết"}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={() => alert('Tệp đã được tải lên!')}
            />
          </div>
          
          {/* Navigation breadcrumb */}
          <div className="flex items-center mb-4 flex-wrap">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentPath([])}
              className="text-sm"
            >
              Trang chủ
            </Button>
            
            {getCurrentPathNames().map((pathInfo, index) => (
              <div key={pathInfo.id} className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-1" />
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                  className="text-sm"
                >
                  {pathInfo.name}
                </Button>
              </div>
            ))}
          </div>
          
          {showDetails ? (
            // Chế độ xem chi tiết
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kích thước
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((item) => (
                    <tr 
                      key={item.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => item.type === 'folder' ? setCurrentPath(prev => [...prev, item.id]) : alert(`Xem trước: ${item.name}`)}
                      onContextMenu={(e) => handleRightClick(e, item)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 mr-2">
                            {item.type === 'folder' 
                              ? <Folder className="w-8 h-8 text-blue-500" />
                              : getFileIcon(item.type, 8)
                            }
                          </div>
                          <div className="ml-1">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.type === 'folder' ? 'Thư mục' : 
                           item.type === 'image' ? 'Hình ảnh' :
                           item.type === 'video' ? 'Video' : 'Tài liệu'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.type === 'folder' ? '--' : item.size}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.dateCreated)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Chế độ xem lưới
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((item) => (
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
                      <span className="text-xs text-gray-500 mt-1">
                        {formatDate(item.dateCreated)}
                      </span>
                    </div>
                  ) : item.type === 'image' ? (
                    <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white p-2">
                        <div className="text-sm truncate">{item.name}</div>
                        <div className="text-xs">{item.size}</div>
                      </div>
                    </div>
                  ) : item.type === 'video' ? (
                    <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                      <Film className="w-12 h-12 text-blue-500" />
                      <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white p-2">
                        <div className="text-sm truncate">{item.name}</div>
                        <div className="text-xs">{item.size}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                      <div className="w-16 h-20 bg-white shadow-md flex items-center justify-center font-bold text-xl">PDF</div>
                      <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white p-2">
                        <div className="text-sm truncate">{item.name}</div>
                        <div className="text-xs">{item.size}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
            icon={contextMenu.item.type === 'folder' ? <Folder className="w-4 h-4" /> : getFileIcon(contextMenu.item.type, 4)} 
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