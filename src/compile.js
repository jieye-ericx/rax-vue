/*
* 专门解析模板内容*/
class Compile {
	constructor(el, vm) {
		//el可以是字符串或dom对象
		this.el = typeof el === "string" ? document.querySelector(el) : el
		this.vm = vm
		if (this.el) {
			//    把el中所有子节点放入内存中，fragment
			let fragment = this.node2fragment(this.el)
			// 在内存中编译fragment
			// console.log(fragment)
			// 把fragment一次性添加到页面
			this.compile(fragment)
			this.el.appendChild(fragment)
		}
	}

	//编译文档碎片，内存中
	compile(fragment) {
		let childNodes = fragment.childNodes
		this.toArray(childNodes).forEach(node => {
			// 编译子节点，如果是元素，解析指令，文本解析插值表达式
			// console.log(node)
			if (this.isElementNode(node)) {
				this.compileElement(node)
			}
			if (this.isTextNode(node)) {
				this.compileText(node)
			}
			if (node.childNodes && node.childNodes.length > 0) {
				this.compile(node)
			}
		})
	}

	compileElement(node) {
		// console.log(111)
		let attributes = node.attributes
		// console.log(attributes)
		this.toArray(attributes).forEach(attr => {
			let attrName=attr.name
			let attrValue=attr.value
			if (this.isDirective(attrName)) {
				let type=attrName.slice(2)
				if(type==='text'){
					node.textContent=this.vm.$data[attrValue]
				}
				if(type==='html'){
					node.innerHTML=this.vm.$data[attrValue]
				}
				if(type==='model'){
					node.value=this.vm.$data[attrValue]
				}
				// 解析v-on
				if (this.isEventDirective(type)){
					let eventType=type.split(':')[1]
					console.log(this)
					node.addEventListener(eventType,this.vm.$methods[attrValue].bind(this.vm))
				}
			}
		})
	}

	compileText(node) {
		// console.log(222)
	}

	node2fragment(node) {
		let fragment = document.createDocumentFragment()
		// el中所有子节点放入内存中，fragment
		let childNodes = node.childNodes
		this.toArray(childNodes).forEach(item => {
			fragment.appendChild(item)
		})
		return fragment
	}

	isElementNode(node) {
		return node.nodeType === 1
	}

	isTextNode(node) {
		return node.nodeType === 3
	}

	isDirective(name) {
		return name.startsWith('v-')
	}
	isEventDirective(name){
		return name.split(':')[0]==='on'
	}

	toArray(likeArr) {
		return [].slice.call((likeArr))
	}
}
