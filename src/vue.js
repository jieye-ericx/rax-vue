class Vue {
	constructor(options = {}) {
		this.$el = options.el
		this.$data = options.data
		this.$methods=options.methods
		if (this.$el) {
			// 解析el,compile负责解析模板内容
			// 需要：模板和数据
			new Compile(this.$el, this)

		}
	}
}