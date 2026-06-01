import axios from 'axios';

// 存储 Blob URL 及其对应的 blob 引用，用于后续释放内存
const blobUrlMap = new Map();

/**
 * 上传图片到后端
 * @param {File} file - 图片文件
 * @param {string} source - 标识符 ('editor', 'article', 'avatar'等)
 * @returns {Promise<string>} - 返回包含 url 和 filename 的对象
 */
export const uploadImage = async (file, source = 'default') => {
  console.log('📷 开始上传图片:', file.name, '| 来源:', source);
  
  const formData = new FormData();
  formData.append('file', file);
  // 标识符，区分上传来源，后端分类
  formData.append('source', source);
    
  try {
    // 上传图片
    const response = await axios.post('/flask/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 5000,  // 5 秒超时
    });
    if(response.data) {
      const url = response.data
      console.log('📤 响应数据:', response.data);
      return url;
    } else {
      console.error('❌ 图片上传失败: 响应数据异常', response.data ? response.data : '');
      throw new Error('响应数据异常，请联系管理员。');
    }
  } catch (error) {
    console.error('❌ 图片上传失败:', error);
    
    // 提取后端返回的错误信息（500 状态码时 jsonify(e) 的内容）
    let errorMsg = '图片上传失败';
    if (error.response?.status === 500 && error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.response?.status) {
      // 其他状态码错误
      errorMsg = `上传失败：HTTP ${error.response.status} ${error.response.statusText}`;
    } else if (error.message) {
      errorMsg = error.message;
    }
    
    alert(errorMsg);
    throw error;
  }
};

/**
 * 释放 Blob URL 占用的内存
 * @param {string} url - 要释放的 Blob URL
 */
/**
 * 通过接口获取图片并创建 Blob URL 用于预览
 * @param {string} url - 图片路径标识
 * @param {string} filename - 图片文件名
 * @returns {Promise<string>} - 返回 Blob URL，可用于 img 标签的 src
 */
export const imageView = async (url) => {
  console.log('👁️ 开始访问接口:', url);
  
  try {
    // 通过接口预览图片
    const response = await axios.get(`/flask${url}`, {
      responseType: 'blob', // 以 Blob 格式接收响应
    });
    
    // 创建 Blob URL
    const blob = new Blob([response.data], { type: response.headers['content-type'] || 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);
    
    // 存储 URL 和 blob 引用，用于后续释放
    blobUrlMap.set(imageUrl, blob);
    
    console.log('🔗 Blob URL:', imageUrl);
    console.log('✅ 图片预览 URL 创建成功');
    
    return imageUrl;
    
  } catch (error) {
    // 如果是 axios 错误（非响应错误），处理 400 等状态码
    if (error.response) {
      console.error('❌ 图片预览失败:', error);
      
      let errorMsg = '图片预览失败';
      if (error.response.status === 500 && error.response?.data?.message) {
        // 尝试解析 Blob 为文本
        if (error.response.data instanceof Blob) {
          try {
            const errorText = await error.response.data.text();
            try {
              const errorData = JSON.parse(errorText);
              errorMsg = errorData.error || errorData.message || JSON.stringify(errorData);
            } catch {
              errorMsg = errorText || '图片预览失败';
            }
          } catch {
            errorMsg = '图片预览失败';
          }
        } else {
          errorMsg = error.response.data.message;
        }
      } else if (error.response.status) {
        errorMsg = `预览失败：HTTP ${error.response.status} ${error.response.statusText}`;
      }
      
      alert(errorMsg);
    } else {
      console.error('❌ 图片预览失败:', error.message);
      alert('图片预览失败：' + error.message);
    }
    throw error;
  }
};

/**
 * 释放 Blob URL 占用的内存
 * @param {string} url - 要释放的 Blob URL
 */
export const revokeImageUrl = (url) => {
  if (url && blobUrlMap.has(url)) {
    URL.revokeObjectURL(url);
    blobUrlMap.delete(url);
    console.log('🗑️ 已释放 Blob URL:', url);
  }
};

/**
 * 释放所有 Blob URL 占用的内存（组件卸载时调用）
 */
export const revokeAllImageUrls = () => {
  blobUrlMap.forEach((blob, url) => {
    URL.revokeObjectURL(url);
  });
  blobUrlMap.clear();
  console.log('🗑️ 已释放所有 Blob URL');
};

/**
 * 上传多个文件到后端
 * @param {File[]} files - 文件数组
 * @param {string} source - 上传来源标识符
 * @returns {Promise<string[]>} - 返回文件 URL 数组
 */
export const uploadFiles = async (files, source = 'default') => {
  console.log('📁 开始上传文件:', files.map(f => f.name), '| 来源:', source);
  
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  formData.append('source', source);
  
  try {
    console.log('📤 发送请求...');
    
    const response = await axios.post('/flask/upload/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000,  // 30 秒超时
    });
    
    if (response.data && response.status === 200) {
      console.log('✅ 文件上传成功');
      // 假设后端返回 { success: true, urls: ['url1', 'url2', ...] }
      return response.data || [];
    } else {
      console.error('❌ 文件上传失败: 响应数据异常', response.data ? response.data : '');
      throw new Error('响应数据异常，请联系管理员。');
    }
  } catch (error) {
    console.error('❌ 文件上传失败:', error);
    
    // 提取后端返回的错误信息（400 状态码时 jsonify(e) 的内容）
    let errorMsg = '文件上传失败';
    if ((error.response?.status === 400 || error.response?.status === 500) && error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.response?.status) {
      // 其他状态码错误
      errorMsg = `上传失败：HTTP ${error.response.status} ${error.response.statusText}`;
    } else if (error.message) {
      errorMsg = error.message;
    }
    
    alert(errorMsg);
    throw error;
  }
};

// 内容长度限制函数
export const contentLengthLimit = (content, maxLength = 100000) => {
  if (content.length > maxLength) {
    alert(`内容长度超过限制（${maxLength} 字符），请精简后再试。当前长度：${content.length} 字符`);
    return false;
  }
  return true;
}

// 异步获取首页数据
export const fetchHomeData = async () => {
  try {
    console.log('📡 开始获取首页数据...');
    const response = await axios.get('/flask/data/home', {
      timeout: 10000,  // 10 秒超时
    });
    if (response.data) {
      // console.log('📤 首页数据获取成功:', response.data);
      return response.data;
    } else {
      console.error('❌ 获取首页数据失败: 响应数据异常', response.data ? response.data : '');
      throw new Error('响应数据异常，请联系管理员。');
    }
  } catch (error) {
    console.error('❌ 获取首页数据失败:', error);
    
    // 提取后端返回的错误信息（400 状态码时 jsonify(e) 的内容）
    let errorMsg = '获取首页数据失败';
    if (error.response?.status === 500 && error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.response?.status) {
      // 其他状态码错误
      errorMsg = `获取首页数据失败：HTTP ${error.response.status} ${error.response.statusText}`;
    } else if (error.message) {
      errorMsg = error.message;
    }
    
    alert(errorMsg);
    throw error;
  }
};

// 合并项目和文章数据
/**
 * @param {Array} articles - 文章数据数组
 * @param {Array} projects - 项目数据数组
 * @returns {Array} - 合并后的数据数组，包含文章和项目
 */
export const combineData = (articles, projects) => {
  // 为每个文章和项目添加一个 type 字段，方便区分
  const formattedArticles = articles.map(article => ({
    ...article,
    id: `article-${article.id}`, // 添加前缀区分 ID
    type: 'article'
  }));
  // 为每个项目添加一个 type 字段，方便区分
  const formattedProjects = projects.map(project => ({
    ...project,
    id: `project-${project.id}`, // 添加前缀区分 ID
    type: 'project'
  }));
  // 合并两个数组
  return [...formattedArticles, ...formattedProjects];
}

// 获取详细的文章或项目信息
export const getDetailPage = async (id) =>{
  try {
    console.log('📡 开始获取详情页数据，ID:', id);
    const response = await axios.get(`/flask/data/detail/${id}`, {
      timeout: 10000,  // 10 秒超时
    });
    
    if (response.data && response.data.message === 'success') {
      console.log('📤 详情页数据获取成功:', response.data);
      return response.data;
    } else {
      console.error('❌ 获取详情页数据失败：响应数据异常', response.data ? response.data : '');
      throw new Error('响应数据异常，请联系管理员。');
    }
  } catch (error) {
    console.error('❌ 获取详情页数据失败:', error);
    
    // 提取后端返回的错误信息（400 状态码时 jsonify(e) 的内容）
    let errorMsg = '获取详情页数据失败';
    if (error.response?.status && error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.response?.status) {
      // 其他状态码错误
      errorMsg = `获取详情页数据失败：HTTP ${error.response.status} ${error.response.statusText}`;
    } else if (error.message) {
      errorMsg = error.message;
    }
    
    alert(errorMsg);
    throw error;
  }
};

export default { 
    uploadImage, 
    imageView, 
    revokeImageUrl, 
    revokeAllImageUrls, 
    uploadFiles, 
    contentLengthLimit,
    fetchHomeData,
    combineData,
    getDetailPage
};
