/*
 *  滑块插件.
 *
 *
 *  * Copyright 2016 (c) liguangfa
 *  * https://github.com/cokucoku/myplugin
 *  *
 *
 *  Date: 2016.6.16
 */
let Slider = function(el, option) {
    let _this = this
    let setoption = {
        theme: 'blue', //red,yellow,black,green,
        size: 'm', //s,m,l
        initvalue: 0,
        showtip: true,
        step: 1,
        showstop: false,
        slideend: function(val) {}
    }
    let settheme = 'red,yellow,black,green,blue'
    let setsize = 's,m,l'
    let myoption = Object.assign(setoption, option)
    let theme = myoption.theme
    let size = myoption.size
    let showtip = myoption.showtip
    let initvalue = myoption.initvalue
    let step = myoption.step
    let showstop = myoption.showstop
    if (settheme.indexOf(theme) == -1) {
        theme = 'blue'
    }
    if (setsize.indexOf(size) == -1) {
        size = 'm'
    }
    //建立骨骼
    let runway = document.createElement("div")
    let bar = document.createElement("div")
    let wrap = document.createElement("div")
    let tooltip = document.createElement("div")
    if (showstop && step != 1) {
        let stops = []
        for (let i = 1; i <= Math.floor(100 / step) - 1; i++) {
            let stop = document.createElement("div")
            stop.classList.add('stop')
            stops.push(stop)
        }
        stops.map(function(item, index) {
            item.style.left = (index + 1) * _this.step + "%"
            runway.appendChild(item)
        });
    }
    let button = document.createElement("div")
    runway.classList.add('slider-runway', theme, size)
    bar.classList.add('slider-bar')
    wrap.classList.add('slider-wrap')
    button.classList.add('slider-button')
    tooltip.classList.add('slider-tooltip')
    wrap.appendChild(button)
    wrap.appendChild(tooltip)
    runway.appendChild(bar)
    runway.appendChild(wrap)
    if (typeof(el) == 'string') {
        var ell = el.split('#')[1]
        el = document.getElementById(ell);
    } else {
        el = el
    }
    el.appendChild(runway)
    if (!showtip) {
        tooltip.style.display = 'none'
    }
    let down = false,
        ov = false,//为了tooltip
        drag=false//为了判断是否有拖动滑块与否
    let fullw = runway.offsetWidth //轨道总长度
    let old_x,
        new_x = initvalue * fullw * 0.01;
    chuli()
    let wrapleft = wrap.offsetLeft //滑塊的位置
    wrap.addEventListener('mouseenter', function(e) {
        ov = true
    })
    wrap.addEventListener('mouseleave', function(e) {
        ov = false
    })
    wrap.addEventListener('mousedown', function(e) {
        //e.stopPropagation()
        down = true
        drag = true
        old_x = e.pageX - wrapleft;
    })
    wrap.addEventListener('touchstart', function(e) {
        //e.stopPropagation()
        drag = true
        down = true
        old_x = e.targetTouches[0].clientX - wrapleft;
    }, { passive: true })
    document.addEventListener('mouseup', function(e) {
        e.preventDefault()
        down = false
        if(drag){
           chuli('end')
        }
        drag=false
        wrapleft = wrap.offsetLeft
    })
    document.addEventListener('mousemove', function(e) {
        e.preventDefault()
        if (down) {
            tooltip.style.opacity = '1'
            new_x = e.pageX - old_x
            chuli()
            wrapleft = wrap.offsetLeft
        } else if (ov) {
            tooltip.style.opacity = '1'
        } else {
            tooltip.style.opacity = ''
        }
    })
    document.addEventListener('touchend', function(e) {
        //e.preventDefault()
        down = false
        if(drag){
           chuli('end')
        }
        drag=false
        wrapleft = wrap.offsetLeft
    }, { passive: true })
    document.addEventListener('touchmove', function(e) {
        //e.preventDefault()
        if (down) {
            wrap.classList.add('hover')
            new_x = e.targetTouches[0].clientX - old_x
            chuli()
            wrapleft = wrap.offsetLeft
        } else {
            wrap.classList.remove('hover')
        }
    }, { passive: true })

    window.addEventListener('resize', function(e) {
        fullw = runway.offsetWidth
        wrapleft = wrap.offsetLeft
    })

    function chuli(string) {
        if (new_x <= 0) {
            new_x = 0
        } else if (new_x >= fullw) {
            new_x = fullw
        }
        var po = Math.floor((new_x / fullw) * 100)
        if (po % step == 0) {
            po = po
        } else {
            if (po % step >= step * 0.5) {
                po = po - (po % step) + step
            } else {
                po = po - (po % step)

            }
        }
        myoption.slideend.call(_this, po,string);
        wrap.style.left = po + '%'
        bar.style.width = po + '%'
        tooltip.innerText = po
    }
    this.go = function(po) {
        //myoption.slideend.call(this, po);
        wrap.style.left = po + '%'
        bar.style.width = po + '%'
        tooltip.innerText = po
        wrapleft = wrap.offsetLeft //滑塊的位置 因為整個拖動關係跟滑塊位置有關係，所以從新要獲取
    }
    this.disabled = function() {
        el.style.cssText="pointer-events: none"
    }
    this.enabled = function() {
        el.style.cssText=""
    }
}
