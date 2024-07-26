// 简单轮播功能
const images = [
    'images/index/pic1.jpg', 'images/index/pic2.jpg', 'images/index/pic3.jpg',
    'images/index/pic4.jpg', 'images/index/pic5.jpg', 'images/index/pic6.jpg',
    'images/index/pic7.jpg', 'images/index/pic8.jpg', 'images/index/pic9.jpg'
];

let currentIndices = [0, 1, 2];

function changeImage(imgId, newIndex) {
    const imgElement = document.getElementById(imgId);
    imgElement.src = images[newIndex];
}

function startCarousel() {
    let i = 0;

    setInterval(() => {
        const newIndex = (currentIndices[i] + 3) % images.length;
        changeImage(`pic${i + 1}`, newIndex);
        currentIndices[i] = newIndex;
        i = (i + 1) % 3;
    }, 2000);
}

window.onload = startCarousel;

// 复制颜色代码
function copyColor(color) {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = color;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('颜色代码 ' + color + ' 已复制到剪贴板');
}

// 添加灵感网址
function addInspiration() {
    const url = document.getElementById('inspiration-url').value;
    if (url.trim() !== "") {
        const newItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = url;
        link.textContent = url;
        link.target = "_blank";

        // 创建删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '-';
        deleteButton.onclick = function() {
            document.getElementById('inspiration-list').removeChild(newItem);
        };

        newItem.appendChild(link);
        newItem.appendChild(deleteButton);
        document.getElementById('inspiration-list').appendChild(newItem);
        document.getElementById('inspiration-url').value = "";
    }
}

// 添加资源文件
function addResource() {
    const fileInput = document.getElementById('resource-file');
    const fileList = document.getElementById('resource-list');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        link.href = URL.createObjectURL(file);
        link.target = "_blank"; // 在新标签页中打开链接
        link.textContent = file.name;

        // 创建删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '-';
        deleteButton.onclick = function() {
            fileList.removeChild(listItem);
        };

        listItem.appendChild(link);
        listItem.appendChild(deleteButton);
        fileList.appendChild(listItem);
    }
}

// 新建创意点子
function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    if (todoInput.value.trim() !== '') {
        const listItem = document.createElement('li');
        listItem.textContent = todoInput.value;

        // 创建删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '-';
        deleteButton.onclick = function() {
            todoList.removeChild(listItem);
        };

        listItem.appendChild(deleteButton);
        todoList.appendChild(listItem);

        todoInput.value = '';
    }
}

// 绘图部分
let canvas = document.getElementById('drawing-canvas');
let ctx = canvas.getContext('2d');
let isDrawing = false;
let brushColor = '#000000';
let brushSize = 5;
let snapshots = []; // 用于保存画布状态
let redoStack = []; // 用于保存撤销操作

// 初始化画布大小
canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

// 导出画布为图片
function exportAsImage() {
    let dataURL = canvas.toDataURL('image/png');
    let link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataURL;
    link.click();
}

// 撤销上一步操作
function undo() {
    if (snapshots.length > 0) {
        redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // 保存当前状态到重做堆栈
        let lastSnapshot = snapshots.pop(); // 取出最后一个快照
        ctx.putImageData(lastSnapshot, 0, 0); // 将画布恢复到上一个快照状态
    }
}

// 重做上一步撤销的操作
function redo() {
    if (redoStack.length > 0) {
        snapshots.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // 保存当前状态到撤销堆栈
        let nextSnapshot = redoStack.pop(); // 取出最后一个重做快照
        ctx.putImageData(nextSnapshot, 0, 0); // 将画布恢复到该快照状态
    }
}

// 清空画布
function clearCanvas() {
    snapshots.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // 保存当前状态到撤销堆栈
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
    redoStack = []; // 清空重做堆栈
}

// 更改画笔颜色
function changeBrushColor() {
    brushColor = document.getElementById('brush-color').value;
}

// 更改画笔粗细
function changeBrushSize() {
    brushSize = document.getElementById('brush-size').value;
}

// 处理鼠标按下事件
canvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    redoStack = []; // 清空重做堆栈
    snapshots.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // 保存当前状态到撤销堆栈
    draw(event); // 立即开始绘画
});

// 处理鼠标松开事件
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath(); // 开始新的路径，以防止连接前后的绘画
});

// 处理鼠标移动事件
canvas.addEventListener('mousemove', draw);

// 绘画函数
function draw(event) {
    if (!isDrawing) return;

    // 获取画布的边界矩形
    let rect = canvas.getBoundingClientRect();
    
    // 计算鼠标位置时，考虑页面滚动的偏移量
    let x = event.clientX - rect.left + window.scrollX;
    let y = event.clientY - rect.top + window.scrollY;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    // 根据鼠标位置绘制
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}
