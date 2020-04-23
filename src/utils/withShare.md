<!--
 * @Author: 邓达
 * @Description: 小程序分享使用
 * @props:
 * @event:
 * @Date: 2020-03-16 10:40:24
 * @LastEditors: 邓达
 * @LastEditTime: 2020-03-16 15:10:29
 -->

# 使用方法

```
import withShare from '@/utils/withShare';

@withShare()

//在class声明之前使用
@withShare({
    title:'',  //分享标题
    imageUrl:'',  //分享图片
    path : "",  //分享地址
    carryId : false  //是否携带用户uid
})

//在类里面请求回来数据再使用
$setSharePath = () => '可设置分享路径(优先级最高)'
$setShareTitle = () => '可设置分享标题(优先级最高)'
$setShareImageUrl = () => '可设置分享图片路径(优先级最高)'
```
