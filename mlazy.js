/**
 * @author: Jason.占友伟 zhanyouwei@icloud.com
 * Created on 16/3/21.
 */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return factory(root);
		});
	} else if (typeof exports === 'object') {
		module.exports = factory;
	} else {
		root.mlazy = factory(root);
	}
})(this, function (root) {

	'use strict';

	var imgList = [],  // 页面所有img元素集合
		delay,   // setTimeout 对象
		offset,  //偏移量，用于指定图片距离可视区域多少距离，进行加载
		lazyTime,  // 延迟载入时间
		_selector; // 选择器 默认为 .m-lazyload

	function _isShow(el) {
		var coords = el.getBoundingClientRect();
		return ( (coords.top >= 0 && coords.left >= 0 && coords.top) <= (root.innerHeight || document.documentElement.clientHeight) + parseInt(offset));
	}

	function _loadImage() {
		for (var i = imgList.length; i--;) {
			var el = imgList[i];
			if (_isShow(el)) {
				el.src = el.getAttribute('data-src');
				el.className = el.className.replace(new RegExp("(\\s|^)" + _selector.substring(1, _selector.length) + "(\\s|$)"), " ");
				imgList.splice(i, 1);
			}
		}
	}

	function _delay() {
		clearTimeout(delay);
		delay = setTimeout(function () {
			_loadImage();
		}, lazyTime);
	}

	function mlazy(selector, options) {
		var defaults = options || {};
		offset = defaults.offset || 100;
		lazyTime = defaults.lazyTime || 100;
		_selector = selector || '.m-lazyload';
		this.getNode();
		_delay();//避免首次加载未触发touch事件,主动触发一次加载函数
		if (defaults.iScroll) {
			defaults.iScroll.on('scrollEnd', _delay);
		} else {
			root.addEventListener('scroll', _delay, false);
		}
	}

	mlazy.prototype.getNode = function () {
		imgList = [];
		var nodes = document.querySelectorAll(_selector);
		for (var i = 0, l = nodes.length; i < l; i++) {
			imgList.push(nodes[i]);
		}
	};

	return mlazy;
});