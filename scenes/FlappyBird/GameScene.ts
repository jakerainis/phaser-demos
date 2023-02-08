import { GameObjects, Math as PMath, Physics, Time } from 'phaser'

import BaseScene from './BaseScene'
import { difficulties } from './config'

import store from '@/stores/flappyBird'

export default class GameScene extends BaseScene {
  bird?: Physics.Arcade.Sprite
  birdInitialPosition: { x: number; y: number }
  countdown?: Time.TimerEvent
  countdownText?: GameObjects.Text
  difficulty: 'easy' | 'medium' | 'hard' | 'oof'
  isPaused: boolean
  pauseBtn?: GameObjects.Image
  pipes?: Physics.Arcade.Group

  constructor() {
    super('GameScene')
    this.birdInitialPosition = {
      x: this.sceneW / 10,
      y: this.sceneH / 2,
    }
    this.difficulty = 'easy'
    this.isPaused = false
  }
  create() {
    super.create()
    //Order matters
    this.createBird()
    this.createPipes()
    this.createButtons()
    this.createEvents()
    this.createScore()
    this.createColliders()
    this.listenEvents()

    // Boot
    this.handleCountdown()
  }
  update(_time: number, _delta: number) {
    this.listenBirdStatus()
    this.listenRecyclePipes()
  }

  /* UTILS */
  createBG() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0)
  }
  createBird() {
    this.bird = this.physics.add
      .sprite(this.birdInitialPosition.x, this.birdInitialPosition.y, 'bird')
      .setFlipX(true)
      .setGravity(0, 600)
      .setScale(3)
    this.bird.setBodySize(this.bird.width, this.bird.height - 8)
    this.bird.setCollideWorldBounds(true)

    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('bird', {
        start: 8,
        end: 15,
      }),
      frameRate: 18,
      repeat: -1,
    })
    this.bird?.play('fly')
  }
  createButtons() {
    this.pauseBtn = this.add
      .image(this.sceneW - 10, this.sceneH, 'pause')
      .setInteractive()
      .setOrigin(1)
      .setScale(3)
  }
  createColliders() {
    if (this?.bird && this?.pipes) {
      this.physics.add.collider(
        this.bird,
        this.pipes,
        this.handleGameOver,
        undefined,
        this
      )
    }
  }
  createEvents() {
    this.input.on('pointerdown', this.handleFlap, this)
    this.input.keyboard.on('keydown-SPACE', this.handleFlap, this)
    this.pauseBtn?.on('pointerdown', this.handlePauseState, this)
  }
  createPipes() {
    this.pipes = this.physics.add.group()
    for (let index = 1; index < 5; index++) {
      const pipeUpper = this.pipes.create(0, 0, 'pipe')
      const pipeLower = this.pipes.create(0, 0, 'pipe')
      this.handlePlacePipes(pipeUpper, pipeLower)
    }
  }
  createScore() {
    this.score = 0
    this.highScore = store.getState().highScore

    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: '32px',
    })
    this.highScoreText = this.add.text(
      16,
      56,
      `High Score: ${this.highScore}`,
      {
        fontSize: '18px',
      }
    )
  }
  getRightMostPipe() {
    let rightMostX = 0
    this.pipes?.getChildren().forEach((pipe) => {
      // This is stupid, but GameObject isn't a generic
      const p = pipe as unknown as Physics.Arcade.Sprite
      rightMostX = Math.max(p.x, rightMostX)
    })
    return rightMostX
  }
  handleCountdown() {
    this.countdown?.destroy()
    this.countdownText?.destroy()
    this.physics.pause()
    let seconds = 3
    this.countdownText = this.add
      .text(this.sceneW / 2, this.sceneH / 2, `Fly in ${seconds}`, {
        fontSize: '24px',
      })
      .setOrigin(0.5)
    this.countdown = this.time.addEvent({
      delay: 1000,
      callback: () => {
        seconds--
        this.countdownText?.setText(`Fly in ${seconds}`)
        if (seconds <= 0) {
          this.countdownText?.destroy()
          this.isPaused = false
          this.physics.resume()
          this.countdown?.remove()
        }
      },
      callbackScope: this,
      loop: true,
    })
  }
  handleFlap() {
    if (!this.isPaused) {
      this.bird?.setVelocityY(-300)
    }
  }
  handleGameOver() {
    this.physics.pause()
    this.bird?.setTint(0xff0000)
    if (this.score > store.getState().highScore) {
      store.getState().updateHighScore(this.score)
    }
    this.time.addEvent({
      callback: () => this.scene.restart(),
      delay: 1000,
      loop: true,
    })
  }
  handleIncreaseScore() {
    this.score++
    this.scoreText?.setText(`Score: ${this.score}`)
    if (this.score > 5) this.difficulty = 'medium'
    if (this.score > 10) this.difficulty = 'hard'
    if (this.score > 15) this.difficulty = 'oof'
    // store.getState().updateScore(this.score)
  }
  handlePauseState() {
    this.isPaused = true
    this.physics.pause()
    this.scene.pause()
    this.scene.launch('PauseScene')
  }
  handlePlacePipes(
    pUpper: Physics.Arcade.Sprite,
    pLower: Physics.Arcade.Sprite
  ) {
    const rightMostPipe = this.getRightMostPipe()
    // const horzDistance = PMath.Between(300, 600)
    const horzDistance = difficulties[this.difficulty].horzDistance
    // const vertDistance = PMath.Between(150, 250)
    const vertDistance = difficulties[this.difficulty].vertDistance
    const vertPos = PMath.Between(30, this.sceneH - 30 - vertDistance)
    pUpper
      .setImmovable(true)
      .setPosition(rightMostPipe + horzDistance, vertPos)
      .setVelocityX(difficulties[this.difficulty].pipeVelocity)
      .setOrigin(0, 1)

    pLower
      .setImmovable(true)
      .setPosition(rightMostPipe + horzDistance, pUpper.y + vertDistance)
      .setVelocityX(difficulties[this.difficulty].pipeVelocity)
      .setOrigin(0, 0)
  }
  listenEvents() {
    this.events.on('resume', this.handleCountdown, this)
  }
  listenBirdStatus() {
    if (!this.bird) return
    if (
      this.bird.getBounds().bottom >= this.sceneH ||
      this.bird.getBounds().top <= 0
    ) {
      this.handleGameOver()
    }
  }
  listenRecyclePipes() {
    const tempPipes: Physics.Arcade.Sprite[] = []
    this.pipes?.getChildren().forEach((pipe) => {
      // This is stupid, but GameObject isn't a generic
      const p = pipe as unknown as Physics.Arcade.Sprite
      if (p.getBounds().right < 0) {
        tempPipes.push(p)
        if (tempPipes.length === 2) {
          this.handlePlacePipes(tempPipes[0], tempPipes[1])
          this.handleIncreaseScore()
        }
      }
    })
  }
}
