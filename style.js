// 调试页面头部样式，跟随vscode主题变化，适配ubuntu、mac等系统

window.addEventListener('load', () => {
	// vscode 颜色主题
	const themeType = getQueryVariable('themeType');
	// 操作系统
	const developSystem = getQueryVariable('developSystem')
	// 是否是弹框页面，可能是内嵌调试
	const isSperateWindow = /sperateWindow/.test(window.location.search)
	const header = document.querySelector('header')
	if (themeType === 1) {
		header.style.backgroundColor = '#dfe1e5'
	}
	if (isSperateWindow) {
		let count = 0
		const timer = function () {
			setTimeout(() => {
				const rootDiv = document.querySelector('.root-view')
				if (rootDiv) {
					rootDiv.style.top = '30px'
				} else if (count < 100) {
					timer()
				}
				count++
			})
		}
		timer()
		if (developSystem !== 'darwin') {
			const div = document.createElement('div')
			header.appendChild(div)
			div.addEventListener('click', () => {
				window.close()
			})
		}
	} else {

		document.body.removeChild(header)
	}
	function getQueryVariable(name) {
		const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		const result = window.location.search.substr(1).match(reg);
		if (result !== null) {
			return decodeURI(result[2]);
		}
		return '';
	}
})


