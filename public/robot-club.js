// 軽量化されたヒューマノイドロボット
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false }); // アンチエイリアス無効化

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false; // 影を無効化
renderer.setClearColor(0x0a0a0a, 1);
document.body.appendChild(renderer.domElement);

// 背景
scene.background = new THREE.Color(0x0a0a0a);

// 最小限のライティング
const ambientLight = new THREE.AmbientLight(0x404080, 0.6);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
mainLight.position.set(10, 20, 10);
scene.add(mainLight);

// シンプルな地面
const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

// 軽量ヒューマノイドロボットクラス
class SimpleHumanoidRobot {
    constructor() {
        this.group = new THREE.Group();
        
        // シンプルなマテリアル
        this.bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
        this.jointMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 });
        this.eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        this.coreMaterial = new THREE.MeshBasicMaterial({ color: 0xff0040 });
        
        this.createSimpleRobot();
        
        // 中央に配置
        this.group.position.y = 0;
        scene.add(this.group);
    }
    
    createSimpleRobot() {
        // 頭部
        const headGeometry = new THREE.BoxGeometry(3, 3, 2.5);
        this.head = new THREE.Mesh(headGeometry, this.bodyMaterial);
        this.head.position.y = 14;
        this.group.add(this.head);
        
        // 目
        const eyeGeometry = new THREE.SphereGeometry(0.25, 8, 8);
        this.leftEye = new THREE.Mesh(eyeGeometry, this.eyeMaterial);
        this.leftEye.position.set(-0.7, 14.3, 1.3);
        this.group.add(this.leftEye);
        
        this.rightEye = new THREE.Mesh(eyeGeometry, this.eyeMaterial);
        this.rightEye.position.set(0.7, 14.3, 1.3);
        this.group.add(this.rightEye);
        
        // 胴体
        const torsoGeometry = new THREE.BoxGeometry(4.5, 7, 2.5);
        this.torso = new THREE.Mesh(torsoGeometry, this.bodyMaterial);
        this.torso.position.y = 8.5;
        this.group.add(this.torso);
        
        // エネルギーコア（シンプル）
        const coreGeometry = new THREE.SphereGeometry(0.8, 8, 8);
        this.core = new THREE.Mesh(coreGeometry, this.coreMaterial);
        this.core.position.set(0, 9, 1.5);
        this.group.add(this.core);
        
        // 左腕
        this.createArm(-4, 'left');
        // 右腕
        this.createArm(4, 'right');
        
        // 左脚
        this.createLeg(-1.8, 'left');
        // 右脚
        this.createLeg(1.8, 'right');
    }
    
    createArm(xPos, side) {
        // 肩
        const shoulderGeometry = new THREE.SphereGeometry(1.2, 8, 8);
        const shoulder = new THREE.Mesh(shoulderGeometry, this.jointMaterial);
        shoulder.position.set(xPos, 11, 0);
        this.group.add(shoulder);
        
        // 上腕（シンプルなボックス）
        const upperArmGeometry = new THREE.BoxGeometry(1.5, 4, 1.5);
        const upperArm = new THREE.Mesh(upperArmGeometry, this.bodyMaterial);
        upperArm.position.set(xPos, 7.5, 0);
        this.group.add(upperArm);
        this[side + 'UpperArm'] = upperArm;
        
        // 前腕
        const forearmGeometry = new THREE.BoxGeometry(1.2, 3.5, 1.2);
        const forearm = new THREE.Mesh(forearmGeometry, this.bodyMaterial);
        forearm.position.set(xPos, 3.5, 0);
        this.group.add(forearm);
        this[side + 'Forearm'] = forearm;
        
        // 手
        const handGeometry = new THREE.BoxGeometry(1, 1.5, 0.8);
        const hand = new THREE.Mesh(handGeometry, this.jointMaterial);
        hand.position.set(xPos, 1.2, 0);
        this.group.add(hand);
    }
    
    createLeg(xPos, side) {
        // 太もも
        const thighGeometry = new THREE.BoxGeometry(1.8, 5, 1.8);
        const thigh = new THREE.Mesh(thighGeometry, this.bodyMaterial);
        thigh.position.set(xPos, 2.5, 0);
        this.group.add(thigh);
        this[side + 'Thigh'] = thigh;
        
        // すね
        const shinGeometry = new THREE.BoxGeometry(1.5, 4.5, 1.5);
        const shin = new THREE.Mesh(shinGeometry, this.bodyMaterial);
        shin.position.set(xPos, -2.5, 0);
        this.group.add(shin);
        this[side + 'Shin'] = shin;
        
        // 足
        const footGeometry = new THREE.BoxGeometry(1.5, 0.8, 3);
        const foot = new THREE.Mesh(footGeometry, this.jointMaterial);
        foot.position.set(xPos, -5.2, 0.5);
        this.group.add(foot);
    }
    
    update(time) {
        // 最小限のアニメーション
        
        // 微細な呼吸（削減）
        const breathe = Math.sin(time * 2) * 0.01;
        this.torso.scale.y = 1 + breathe;
        
        // エネルギーコアの回転（軽量化）
        this.core.rotation.y += 0.02;
        
        // 目の色変化（最小限）
        const hue = (time * 0.3) % 1;
        this.leftEye.material.color.setHSL(hue, 1, 0.5);
        this.rightEye.material.color.setHSL(hue, 1, 0.5);
        
        // 腕の微細な動き（削減）
        this.leftUpperArm.rotation.z = Math.sin(time * 1.2) * 0.05;
        this.rightUpperArm.rotation.z = -Math.sin(time * 1.2) * 0.05;
    }
}

// ヒューマノイドロボットを作成
const humanoid = new SimpleHumanoidRobot();

// カメラの初期位置
camera.position.set(0, 8, 18);
camera.lookAt(0, 7, 0);

// マウス制御（簡素化）
let mouseX = 0;
let mouseY = 0;
let cameraAngle = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ズーム制御（簡素化）
document.addEventListener('wheel', (event) => {
    const distance = camera.position.distanceTo(new THREE.Vector3(0, 7, 0));
    const newDistance = Math.max(12, Math.min(30, distance + event.deltaY * 0.05));
    
    const direction = camera.position.clone().sub(new THREE.Vector3(0, 7, 0)).normalize();
    camera.position.copy(direction.multiplyScalar(newDistance).add(new THREE.Vector3(0, 7, 0)));
    camera.lookAt(0, 7, 0);
});

// フレームレート制限
let lastTime = 0;
const targetFPS = 30; // 30FPSに制限
const frameInterval = 1000 / targetFPS;

// アニメーションループ（軽量化）
function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // フレームレート制限
    if (currentTime - lastTime < frameInterval) return;
    lastTime = currentTime;
    
    const time = currentTime * 0.001;
    
    // ヒューマノイドの更新
    humanoid.update(time);
    
    // カメラの自動回転 + マウス制御（簡素化）
    cameraAngle += 0.003; // 自動回転速度を下げる
    cameraAngle += mouseX * 0.005; // マウス感度を下げる
    
    const radius = 18;
    camera.position.x = Math.sin(cameraAngle) * radius;
    camera.position.z = Math.cos(cameraAngle) * radius;
    camera.position.y = 8 + mouseY * 3;
    camera.lookAt(0, 7, 0);
    
    renderer.render(scene, camera);
}

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 入会ボタンの処理
function joinClub() {
    alert('ロボット研究会へようこそ！\n詳細は部室またはメールでお問い合わせください。\n\nEmail: robot.club@university.edu');
}

// アニメーション開始
animate(0);