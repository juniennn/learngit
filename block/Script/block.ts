const { ccclass, property } = cc._decorator;
import Global from "./Global/Global"
@ccclass
export default class block extends cc.Component {
    // update (dt) {}

    @property
    blockType = "black"
    bTouch = false
    private _color = {
        black: new cc.Color(0, 255, 255),
        white: new cc.Color(255, 0, 0)
    }

    init(color = "white") {
        this.blockType = color
        this.node.width = cc.winSize.width / 4 - 1
        this.node.height = cc.winSize.height / 4
        this.node.color = this._color[color]
    }
}
