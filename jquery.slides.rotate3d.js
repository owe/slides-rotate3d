/**
 * Rotate 3D | Slides transition plugin
 * Copyright (C) 2011 Oktober Media DA
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 * @author Erling Owe <owe@oktobermedia.no>
 * @copyright Oktober Media DA, 2011
 */


(function($) {
	
	var defaultOptions = {
		speed: 1000,
		perspective: 2000,
		axis: 'x', // Can be 'x' or 'y'.
		fade: false,
		sides: 3,
		margin: 0,
		contain: false
	};
	
	var opts;
	
	$.slides.registerTransition({
		
		name: 'rotate3d',
		
		transition: function(o, callback) {

			var currentSlide = o.slides.eq(o.index);
			var newSlide = o.slides.eq(o.transitionTo);


			// Initialize.
			if (o.playBackwards) {
				newSlide.css('-webkit-transform', 'rotate' + opts.axis.toUpperCase() + '(-' + opts.angle + 'deg) translateZ(' + opts.zDistance + 'px)');
			} else {
				newSlide.css('-webkit-transform', 'rotate' + opts.axis.toUpperCase() + '(' + opts.angle + 'deg) translateZ(' + opts.zDistance + 'px)');
			}
			
			//newSlide.css('opacity', '1');

			// Apply transition.
			setTimeout(function() { // NOTE: Workaround for wierd behaviour where the transition is applied to the initialization as well.
				
				if (opts.fade) {
					o.slides.css('-webkit-transition', 'all ' + opts.speed + 'ms ease-in-out');
					currentSlide.css('opacity', '0');
				} else {
					o.slides.css('-webkit-transition', '-webkit-transform ' + opts.speed + 'ms ease-in-out');
				}
				
				// Contain.
				if (opts.contain) {
					o.innerContainer.css('-webkit-animation', "'" + opts.animationContain + "' " + opts.speed + 'ms ease-in-out');
					o.innerContainer.one('webkitAnimationEnd', function() {
						o.innerContainer.css('-webkit-animation', '');
					});
				}

				// Animate.
				newSlide.css('-webkit-transform', 'rotate' + opts.axis.toUpperCase() + '(0deg) translateZ(' + opts.zDistance + 'px)');
				newSlide.css('opacity', '1');

				if (o.playBackwards) {
					currentSlide.css('-webkit-transform', 'rotate' + opts.axis.toUpperCase() + '(' + opts.angle + 'deg) translateZ(' + opts.zDistance + 'px)');
				} else {
					currentSlide.css('-webkit-transform', 'rotate' + opts.axis.toUpperCase() + '(-' + opts.angle + 'deg) translateZ(' + opts.zDistance + 'px)');
				}

				// Clean up and call callback.
				currentSlide.one('webkitTransitionEnd', function() {
					o.slides.css('-webkit-transition', 'initial');
					currentSlide.css('opacity', '0');
					callback();
				});
			
			}, 0);

		}, 
		
		init: function(o) {
			
			// TODO: Validate the options.
			opts = jQuery.extend({}, defaultOptions, o.options);

			// NOTE: Maybe this should've been calculated with radians instead...
			opts.angle = 360 / opts.sides;
			opts.sideLength = ((opts.axis === 'x') ? o.outerContainer.height() : o.outerContainer.width()) + (opts.margin * 2);
			opts.zDistance = Math.tan((opts.sides - 2) * 90 / opts.sides * Math.PI / 180) * (opts.sideLength / 2);

			if (opts.contain) {
				var uniqid = ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18);
				opts.animationContain = uniqid + '-slides-rotate3d-contain';
				opts.zDistanceMax = (opts.sideLength / 2) / Math.cos((opts.sides - 2) * 90 / opts.sides * Math.PI / 180); console.log(opts.zDistanceMax);
				$('head').append("<style>@-webkit-keyframes '" + opts.animationContain + "' { 0% { -webkit-transform: translateZ(-" + opts.zDistance + "px); } 50% { -webkit-transform: translateZ(-" + opts.zDistanceMax + "px); } 100% { -webkit-transform: translateZ(-" + opts.zDistance + "px); } }</style>");
			}


			var currentSlide = o.slides.eq(o.index);

			o.outerContainer.css('-webkit-perspective', opts.perspective);

			o.innerContainer.css('-webkit-transform', 'translateZ(-' + opts.zDistance + 'px)');
			o.innerContainer.css('-webkit-transform-style', 'preserve-3d');


			o.slides.css('display', 'block')
			o.slides.not(currentSlide).css('opacity', '0');
			//obj.slides.not(currentSlide).css('-webkit-transform', 'rotateX(' + opts.angle + 'deg) translateZ(' + opts.zDistance + 'px)');

			currentSlide.css('-webkit-transform', 'rotate' + opts.axis.toUpperCase() + '(0deg) translateZ(' + opts.zDistance + 'px)');
		
		}
		
	});
	
})(jQuery);