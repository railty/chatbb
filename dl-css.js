const axios = require("axios");
const ffs = require('final-fs');

const beautify_js = require('js-beautify'); // also available under "js" export
const beautify_css = require('js-beautify').css;
const beautify_html = require('js-beautify').html;

async function dl_res(url, filename){
    let res = await axios.get(url, {responseType: 'stream'});
    res.data.pipe(ffs.createWriteStream(filename));
}

async function dlWechatCss(bCache){
    console.log("download css");

    const urlCss = "https://res.wx.qq.com/a/wx_fed/webwx/res/static/css/c8dda94a1c135ba17e5706ebc4aab1bf.css";
    
    try{
        let css = '';
        if (bCache){
            css = await ffs.readFile('wechat_raw.css', 'utf8');
        }
        else{
            let res = await axios.get(urlCss);
            //console.log(res.data);
            await ffs.writeFile('wechat_raw.css', res.data, 'utf8');
            css = res.data;
        }
//      console.log(css);
        css = beautify_css(css, {
            indent_size: 2, 
            selector_separator_newline: false
        });

        res = {};
        css = css.replace(/url\((.*)\)/g, (match, url)=>{
            filename = url.match(/([^\/]*)$/)[1];
            res[url] = filename;

            return `url(/assets/wechat/image/${filename})`;
        });

        css = css.replace('\\0', ';');
        css = css.replace('\\\\5FAE\\8F6F\\96C5\\9ED1', "'\\5FAE\\8F6F\\96C5\\9ED1'");  //微软雅黑
        
        await ffs.writeFile('wechat.css', css, 'utf8');

        //console.log(res);
        for (let url of Object.keys(res)){
            console.log(`download http:${url} to image/${res[url]}`);
            //await dl_res(`http:${url}`, `image/${res[url]}`);
        }


        await dl_res("https://web.wechat.com/zh_CN/htmledition/v2/images/spacer.gif", 'image/spacer.gif');

        console.log("manual changes:");
        console.log("cp ../tools/wechat.css public/wechat/");
        console.log("cp image ../NodeBB/public/wechat/ -R");    
    }
    catch(e){
        console.log(e);
    }

}

dlWechatCss(true);
