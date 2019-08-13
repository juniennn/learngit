import block from "./block";
import Global from "./Global/Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameServer extends cc.Component {
    @property(cc.Prefab)
    block = null
    @property(cc.Node)
    gameNode = null
    @property(cc.Label)
    score = null

    @property
    private _blocks: block[] = []
    private _speed = 300
    private _scale = 20
    private _coefficient = 20
    private _winHeight

    start() {
        this._winHeight = cc.winSize.height
        this.gameNode.x = cc.winSize.width / -2
        this.gameNode.y = this._winHeight / -2
        let white = 0
        for (let i = 0; i < 24; i++) {
            let block = cc.instantiate(this.block)
            this.gameNode.addChild(block)
            let blockSpt = block.getComponent("block") as block
            if (i % 4 == 0)
                white = Math.floor(Math.random() * 3)
            if (i % 4 == white)
                blockSpt.init("white")
            else
                blockSpt.init("black")
            block.x = i % 4 * (block.width + 1)
            block.y = Math.floor(i / 4) * (block.height + 1) - block.height + 500
            this._blocks.push(blockSpt)
            blockSpt.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this)
        }
    }

    private _onTouchStart(e: cc.Event) {
        let blockSpt = e.target.getComponent("block") as block
        if (blockSpt) {
            if (blockSpt.blockType == "white") {
                if (!blockSpt.bTouch) {
                    Global.score++
                    this.score.string = "分数：" + Global.score
                    blockSpt.bTouch = true
                    this._scale++
                }
            } else {
                cc.director.loadScene("GameOver")
            }
        }
    }

    update(t) {
        let whiteIdx = Math.floor(Math.random() * 3)
        for (let i = 0, len = this._blocks.length; i < len; i++) {
            this._blocks[i].node.y -= this._speed * t * this._scale / this._coefficient
            if (this._blocks[i].node.y <= 0) {
                this._blocks[i].node.y += (this._winHeight + 6 + this._blocks[i].node.height * 2)
                if (this._blocks[i].bTouch == false && this._blocks[i].blockType == "white") {
                    cc.director.loadScene("GameOver")
                }
                this._blocks[i].bTouch = false
                if (i % 4 == whiteIdx)
                    this._blocks[i].init("white")
                else {
                    this._blocks[i].init("black")
                }
            }
        }
    }
}
