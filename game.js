// 全局变量
let scene, camera, renderer, truck, controls;
let mapIndex = 0;
const maps = [
    { size: [100, 100], color: 0x00ff00 }, // 地图1
    { size: [200, 200], color: 0x0000ff }, // 地图2
    { size: [150, 150], color: 0xff0000 }, // 地图3
    { size: [250, 250], color: 0xffff00 }, // 地图4
    { size: [300, 300], color: 0xff00ff }  // 地图5
];

// 初始化场景
function init() {
    // 创建场景
    scene = new THREE.Scene();

    // 创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 添加地面
    createGround();

    // 添加卡车
    const truckGeometry = new THREE.BoxGeometry(2, 1, 3);
    const truckMaterial = new THREE.MeshPhongMaterial({ color: 0xffaa00 });
    truck = new THREE.Mesh(truckGeometry, truckMaterial);
    scene.add(truck);

    // 添加灯光
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 10);
    scene.add(light);

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // 添加控制器
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // 渲染循环
    animate();
}

// 创建地面
function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(maps[mapIndex].size[0], maps[mapIndex].size[1]);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: maps[mapIndex].color, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.name = 'ground';
    scene.add(ground);
}

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// 切换视角
let currentView = 0;
function switchView() {
    currentView = (currentView + 1) % 3;
    if (currentView === 0) {
        camera.position.set(0, 10, 20); // 第三人称视角
    } else if (currentView === 1) {
        camera.position.set(0, 2, 5); // 第一人称视角
    } else if (currentView === 2) {
        camera.position.set(0, 20, 0); // 俯视视角
    }
}

// 撞击效果
function applyDamage() {
    const geometry = truck.geometry;
    const vertices = geometry.vertices;

    // 随机选择一个顶点并向下移动，模拟撞击效果
    const index = Math.floor(Math.random() * vertices.length);
    vertices[index].y -= 0.5;

    // 更新几何体
    geometry.verticesNeedUpdate = true;
}

// 切换地图
function switchMap() {
    mapIndex = (mapIndex + 1) % maps.length;
    const ground = scene.getObjectByName('ground');
    scene.remove(ground); // 移除旧地面
    createGround(); // 创建新地面
}

// 键盘事件监听
document.addEventListener('keydown', (event) => {
    if (event.key === 'v' || event.key === 'V') {
        switchView(); // 切换视角
    }
    if (event.key === 'd' || event.key === 'D') {
        applyDamage(); // 模拟撞击
    }
    if (event.key === 'm' || event.key === 'M') {
        switchMap(); // 切换地图
    }
});

// 初始化游戏
init();