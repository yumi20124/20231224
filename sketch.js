var sound1;
function preload() {
  sound1 = loadSound("[no copyright music] cute joyful music play with me cute bgm funny (1).mp3");
}

let strawberries = [];
let stbr_colors = ["#ff0000", "#ffffff"]; // 草莓顏色
let inputText = "草莓"; // 預設文字框文字
let isMusicPlaying = false; // 用於檢查音樂播放狀態
let btnMove, btnStop, btnVoice, inputBox;

function setup() {
  createCanvas(windowWidth, windowHeight);
  analyzer = new p5.Amplitude();
  analyzer.setInput(sound1);

  // 生成草莓
  for (let i = 0; i < 5; i++) {
    let strawberry = {
      x: random(width),
      y: random(height),
      size: random(50, 80), // 放大草莓
      color: random(stbr_colors),
      vx: random(1, 3),
      vy: random(1, 3),
      moving: true,
    };
    strawberries.push(strawberry);
  }

  // 移動按鈕
  btnMove = createButton("移動");
  btnMove.position(10, height - 80);
  btnMove.mousePressed(moveStrawberries);

  // 暫停按鈕
  btnStop = createButton("暫停");
  btnStop.position(110, height - 80);
  btnStop.mousePressed(stopStrawberries);

  // 語音按鈕
  btnVoice = createButton("語音");
  btnVoice.position(210, height - 80);
  btnVoice.mousePressed(startVoiceRecognition);

  // 文字輸入框
  inputBox = createInput(inputText);
  inputBox.position(width - 210, height - 40);
  inputBox.size(200, 20);
  inputBox.input(updateInputText);
}

function draw() {
  background("#ffc8dd");

  // 繪製草莓和文字
  for (let i = 0; i < strawberries.length; i++) {
    let strawberry = strawberries[i];
    let level = analyzer.getLevel(); // 取得音樂振幅
    let newSize = map(level, 0, 1, 30, 100); // 將音樂振幅映射為圖案大小範圍
    strawberry.size = newSize;

    // 繪製草莓
    drawStrawberry(strawberry.x, strawberry.y, strawberry.size, strawberry.color);

    // 繪製眼珠
    let eyeSize = strawberry.size / 5; // 眼睛大小
    let eyeOffsetX = strawberry.size / 4; // 眼睛 X 座標偏移
    let eyeOffsetY = strawberry.size / 6; // 眼睛 Y 座標偏移
    let eyeBallX = strawberry.x + map(mouseX, 0, width, -eyeOffsetX, eyeOffsetX);
    let eyeBallY = strawberry.y + map(mouseY, 0, height, -eyeOffsetY, eyeOffsetY);

    fill("#000000"); // 黑色眼眶
    ellipse(strawberry.x - eyeOffsetX, strawberry.y - eyeOffsetY, eyeSize * 2, eyeSize * 2);
    ellipse(strawberry.x + eyeOffsetX, strawberry.y - eyeOffsetY, eyeSize * 2, eyeSize * 2);

    fill("#ffffff"); // 白色眼球
    ellipse(eyeBallX - eyeOffsetX, eyeBallY - eyeOffsetY, eyeSize, eyeSize);
    ellipse(eyeBallX + eyeOffsetX, eyeBallY - eyeOffsetY, eyeSize, eyeSize);

    // 繪製嘴巴
    fill("#ff0000"); // 紅色嘴巴
    arc(
      strawberry.x,
      strawberry.y + strawberry.size / 6,
      strawberry.size / 2,
      strawberry.size / 4,
      0,
      PI,
      CHORD
    );

    // 繪製文字
    fill("#000000");
    noStroke(); // 不要線條
    textSize(14);
    textAlign(CENTER, TOP);
    text(inputText, strawberry.x, strawberry.y + strawberry.size / 2 + 10);

    if (strawberry.moving) {
      strawberry.x += strawberry.vx;
      strawberry.y += strawberry.vy;

      // 草莓碰到邊界反彈
      if (strawberry.x > width || strawberry.x < 0) {
        strawberry.vx *= -1;
      }
      if (strawberry.y > height || strawberry.y < 0) {
        strawberry.vy *= -1;
      }
    }
  }
}

// 自訂函數：繪製草莓
function drawStrawberry(x, y, size, color) {
  fill(color);
  stroke("#000000"); // 設定黑色線框
  strokeWeight(2); // 設定線條寬度
  ellipse(x, y, size, size);

  fill("#00cc00"); // 草莓葉子的顏色
  beginShape();
  vertex(x - size / 2, y - size / 2 - 10);
  quadraticVertex(x, y - size / 2 - 30, x + size / 2, y - size / 2 - 10);
  endShape(CLOSE);
}

// 移動按鈕的事件處理函數
function moveStrawberries() {
  for (let strawberry of strawberries) {
    strawberry.moving = true;
  }
}

// 暫停按鈕的事件處理函數
function stopStrawberries() {
  for (let strawberry of strawberries) {
    strawberry.moving = false;
  }
}

// 語音辨識的相關設定
let lang = navigator.language;
let myRec = new p5.SpeechRec(lang, gotSpeech);

function startVoiceRecognition() {
  myRec.start();
}

function gotSpeech() {
  if (myRec.resultValue) {
    let command = myRec.resultString.toLowerCase();
    if (command.includes("走")) {
      moveStrawberries();
    } else if (command.includes("停")) {
      stopStrawberries();
    }
  }
}

// 文字輸入框的事件處理函數
function updateInputText() {
  inputText = this.value();
}

function mousePressed() {
  // 檢查是否按到按鈕區域
  if (
    !(
      mouseX > btnMove.position().x &&
      mouseX < btnMove.position().x + btnMove.width &&
      mouseY > btnMove.position().y &&
      mouseY < btnMove.position().y + btnMove.height
    ) &&
    !(
      mouseX > btnStop.position().x &&
      mouseX < btnStop.position().x + btnStop.width &&
      mouseY > btnStop.position().y &&
      mouseY < btnStop.position().y + btnStop.height
    ) &&
    !(
      mouseX > btnVoice.position().x &&
      mouseX < btnVoice.position().x + btnVoice.width &&
      mouseY > btnVoice.position().y &&
      mouseY < btnVoice.position().y + btnVoice.height
    ) &&
    !(
      mouseX > inputBox.position().x &&
      mouseX < inputBox.position().x + inputBox.width &&
      mouseY > inputBox.position().y &&
      mouseY < inputBox.position().y + inputBox.height
    )
  ) {
    // 不在按鈕區域，處理音樂開關
    if (isMusicPlaying) {
      sound1.pause();
    } else {
      sound1.loop();
    }
    isMusicPlaying = !isMusicPlaying;
  }
}