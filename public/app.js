// 軽量化されたロボット研究会ページ
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false }); // アンチエイリアシング無効

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false; // 影を無効化
renderer.setClearColor(0x000510, 1);
document.body.appendChild(renderer.domElement);

// 軽量化: フォグを追加してレンダリング範囲を制限
scene.fog = new THREE.Fog(0x000510, 50, 200);

// ライティングを最小限に
const ambientLight = new THREE.AmbientLight(0x404080, 0.8);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 0.5);
mainLight.position.set(50, 50, 50);
scene.add(mainLight);

// シンプルな地面
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x001122 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2;
scene.add(ground);

// 軽量グリッド（線の数を削減）
const gridHelper = new THREE.GridHelper(100, 20, 0x00ffff, 0x004444);
gridHelper.position.y = -1.9;
scene.add(gridHelper);

// タワーを減らす（8個→4個）
for (let i = 0; i < 4; i++) {
    const height = Math.random() * 30 + 15;
    const towerGeometry = new THREE.BoxGeometry(3, height, 3); // シリンダーからボックスに変更
    const towerMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(0.1, 0.3 + Math.random() * 0.3, 0.8)
    });
    
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.x = (Math.random() - 0.5) * 80;
    tower.position.y = height / 2 - 2;
    tower.position.z = (Math.random() - 0.5) * 80;
    
    scene.add(tower);
}

// ロボット格納用配列
const robots = [];
const maxRobots = 5; // 最大ロボット数を制限

// 軽量化されたロボットクラス
class SimplifiedRobot {
    constructor(x, z) {
        this.group = new THREE.Group();
        this.animationPhase = Math.random() * Math.PI * 2;
        
        // シンプルな形状のロボット
        // 頭部
        const headGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const headMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.y = 4;
        this.group.add(this.head);
        
        // 目
        const eyeGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        
        this.leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.leftEye.position.set(-0.4, 4.2, 0.6);
        this.group.add(this.leftEye);
        
        this.rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.rightEye.position.set(0.4, 4.2, 0.6);
        this.group.add(this.rightEye);
        
        // 胴体
        const bodyGeometry = new THREE.BoxGeometry(2, 3, 1.5);
        const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.y = 2;
        this.group.add(this.body);
        
        // エネルギーコア（シンプルに）
        const coreGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xff0040 });
        this.core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.core.position.y = 2;
        this.group.add(this.core);
        
        // 配置
        this.group.position.x = x;
        this.group.position.z = z;
        this.group.position.y = -2;
        
        scene.add(this.group);
    }
    
    update(time) {
        const phase = time + this.animationPhase;
        
        // 最小限のアニメーション
        this.group.position.y = -2 + Math.sin(phase) * 0.1;
        this.core.rotation.y += 0.02;
        
        // 目の色変化（重い処理を削除）
        this.leftEye.material.color.setHSL((time * 0.5) % 1, 1, 0.5);
        this.rightEye.material.color.setHSL((time * 0.5) % 1, 1, 0.5);
    }
    
    dispose() {
        // メモリ解放
        this.group.children.forEach(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
        scene.remove(this.group);
    }
}

// パーティクルを削減（50個→15個）
const floatingParticles = [];

class LightParticle {
    constructor() {
        const geometry = new THREE.SphereGeometry(0.1, 6, 6); // ジオメトリを簡素化
        const material = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color(Math.random(), Math.random(), 1),
            transparent: true,
            opacity: 0.6
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.x = (Math.random() - 0.5) * 100;
        this.mesh.position.y = Math.random() * 30;
        this.mesh.position.z = (Math.random() - 0.5) * 100;
        
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05
        );
        
        scene.add(this.mesh);
    }
    
    update() {
        this.mesh.position.add(this.velocity);
        
        // 境界チェック（簡素化）
        if (Math.abs(this.mesh.position.x) > 50) this.velocity.x *= -1;
        if (this.mesh.position.y > 30 || this.mesh.position.y < 0) this.velocity.y *= -1;
        if (Math.abs(this.mesh.position.z) > 50) this.velocity.z *= -1;
    }
    
    dispose() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        scene.remove(this.mesh);
    }
}

// 初期パーティクル生成（減らす）
for (let i = 0; i < 15; i++) {
    floatingParticles.push(new LightParticle());
}

// カメラ制御
camera.position.set(0, 15, 30);
let mouseTarget = { x: 0, y: 0 };

document.addEventListener('mousemove', (event) => {
    mouseTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseTarget.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// クリックでロボット生成（制限付き）
document.addEventListener('click', (event) => {
    if (robots.length < maxRobots) {
        const x = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 40;
        robots.push(new SimplifiedRobot(x, z));
        
        // 統計更新
        if (document.getElementById('robotCount')) {
            document.getElementById('robotCount').textContent = robots.length;
        }
    } else {
        // 古いロボットを削除して新しいものを追加
        const oldRobot = robots.shift();
        oldRobot.dispose();
        
        const x = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 40;
        robots.push(new SimplifiedRobot(x, z));
    }
});

// 初期ロボット生成
robots.push(new SimplifiedRobot(0, 0));
robots.push(new SimplifiedRobot(15, 15));
robots.push(new SimplifiedRobot(-15, 15));

// ローディング画面を非表示
setTimeout(() => {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 1000);
    }
}, 1000);

// パフォーマンス改善: フレームレート制限
let lastTime = 0;
const frameRate = 60; // 60FPS
const frameInterval = 1000 / frameRate;

function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // フレームレート制限
    if (currentTime - lastTime < frameInterval) return;
    lastTime = currentTime;
    
    const time = currentTime * 0.001;
    
    // マウス追従（軽量化）
    const damping = 0.02;
    camera.position.x += (mouseTarget.x * 20 - camera.position.x) * damping;
    camera.position.y += (15 + mouseTarget.y * 5 - camera.position.y) * damping;
    camera.lookAt(0, 0, 0);
    
    // ロボットのアニメーション更新
    robots.forEach(robot => robot.update(time));
    
    // パーティクルの更新（間引き）
    if (Math.floor(time * 60) % 3 === 0) {
        floatingParticles.forEach(particle => particle.update());
    }
    
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