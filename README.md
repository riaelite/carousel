<h1>carousel.js - jQuery 按需加载轮播图插件</h1>
========
<h2>插件简介</h2>
<p>jQuery 的轮播图插件数不胜数，到底哪个最好，这个不好评判，因为没有最好的插件，只有最合适的插件。我做这个插件的主旨就是——“<strong>简单</strong>”，让使用这款插件变得简单，容易上手，而又不失其功能。</p>
<h2>支持的功能</h2>
<ul>
    <li>支持自动轮播</li>
    <li>多样化的轮播效果</li>
    <li>可选的轮播触发方式</li>
    <li>支持两种模式：全自动（无需 Dom 节点）和半自动（需要 Dom 节点）</li>
    <li>可自定义的轮播图尺寸</li>
    <li>可自定义的预加载图片</li>
    <li>可自定义的轮播切换速度</li>
    <li>可自定义的轮播间隔时间</li>
</ul>
<h2>插件的特点</h2>
<ul>
    <li>简单易用。</li>
    <li>按需加载，只加载即将显示的那张图片，节省流量开销。</li>
    <li>采用 MVC 模式，易扩展，易维护。</li>
</ul>
<h2>开始使用</h2>
<h3>全自动模式</h3>
<p>简单来说，就是<strong>一个空标签 + 一段 JS 调用 = 一个轮播图</strong>，甚至都不需要写样式。</p>
<h4>HTML</h4>
<pre>
&lt;div id="demo1"&gt;&lt;/div&gt;</pre>
<h4>JavaScript</h4>
<pre>
$('#demo1').carousel({
    data: [
        {
            url: 'http://wange.im/',
            img: 'img/1.jpg',
            text: 'Life Studio'
        },
        {
            url: 'http://t.qq.com/wange1228',
            img: 'img/2.jpg',
            text: '@wange1228'
        }
    ]
});</pre>
<h3>半自动模式</h3>
<p>出于 SEO 的考虑，我们可能需要用 HTML 建立节点，插件也是支持这种情况的。这时我们需要如下结构的 HTML + JavaScript：</p>
<h4>HTML</h4>
<pre>
&lt;div id="demo2"&gt;
    &lt;div class="carousel_panel"&gt;
        &lt;ul&gt;
            &lt;li&gt;
                &lt;a target="_blank" title="Life Studio" href="http://v.61.com/comic/7512/"&gt;
                    &lt;img src="img/1.jpg" alt="Life Studio" /&gt;
                &lt;/a&gt;
            &lt;/li&gt;
            &lt;li&gt;
                &lt;a target="_blank" title="@wange1228" href="http://v.61.com/zt/shengrimengjingling/"&gt;
                    &lt;img src="img/2.jpg" alt="@wange1228" /&gt;
                &lt;/a&gt;
            &lt;/li&gt;
        &lt;/ul&gt;
    &lt;/div&gt;
&lt;/div&gt;</pre>
<h4>JavaScript</h4>
<pre>
$('#demo2').carousel();</pre>
<p>这样就完成了一个简单的轮播图，如果需要更多个性化的功能，还可以参看以下参数。</p>
<h2>可选参数</h2>
<pre>
/**
 * @description 基于 jQuery 的按需加载轮播图插件
 * @param data {Array} 轮播图的数据 [{url: '', img: '', text: ''}]
          auto {boolean} 是否自动轮播
          interval {number} 轮播间隔时间（毫秒）
          speed {number} 轮播切换速度（毫秒）
          width: {number} 轮播图宽度
          height: {number} 轮播图高度
          loadingImg: {String} 加载中图片地址
          showType: {String} 显示轮播图方式 fade / horizontal / vertical
          triggerType: {String} 触发轮播方式 click / mouseover
 * @author i@wange.im
 * @url https://github.com/wange1228/carousel
 * @version 0.1.2
**/</pre>
<h2>即将上线的功能</h2>
<ul>
    <li>支持每次轮播的回调事件</li>
    <li>支持自定义样式</li>
    <li><a href="mailto:i@wange.im" title="给我发邮件">听听你的意见</a></li>
</ul>
