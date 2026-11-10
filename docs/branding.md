# TSNav 图标

圆形图标：`design/icons/tsnav-icon-circle-1024.png`，1024×1024 RGBA PNG，圆外透明。保留为最初的生成稿；目前项目使用下述矢量重绘版本。

参考：`design/TSTab_icon.png`。保留姊妹项目柔和蓝色渐变、暖白色几何形状和轻微层叠质感，改用罗盘和轨道节点表达导航与站点连接，与参考图的太阳、地平线意象区分。

使用内置 image_gen 生成；原始输出通过 ImageMagick 等比导出为精确 1024×1024，保留透明通道。

## 生成提示词

Use case: logo-brand. Generate one final app icon for TSNav, a website navigation directory, as a 1024 x 1024 pixel PNG. Input image is ONLY a visual style and color reference from sister product TSTab. Create a CIRCULAR icon with genuine transparent alpha outside the circle and a small even safety margin. Match the reference's very restrained soft blue gradients, clean simple large geometric shapes, warm ivory highlights and subtle layered paper-like depth. Coordinate with TSNav Azure palette: sky blue #93ccff and #78d1ff, pale blue #c3e8ff and deeper azure #006194. Entirely DIFFERENT imagery and composition from reference: NO sun, NO horizon, NO landscape, NO hills, NO road. Instead design an elegant abstract navigation compass inside the blue circular disk: a bold minimal warm-ivory elongated diamond pointer oriented northeast, with a smaller soft light-blue counterpoint toward southwest, a clean small round center pivot, and a fine partial orbital arc with just three subtle round destination nodes distributed around the compass. The compass and nodes form one cohesive simple recognizable mark suggesting wayfinding and a hub of useful websites. Strong central silhouette readable at favicon scale, balanced generous interior negative space, beautifully restrained rather than busy. The circular disk has a soft luminous sky-blue to richer azure gradient, gently shaded vector-like surfaces, front-facing orthographic flat app icon, no metallic textures, no heavy 3D, no bevel rim. Main compass mark uses creamy off-white contrasted with azure, not harsh black. No letters, text, N/E/S/W, wordmark, captions, stars, decorative speckles, extra border, mockup, or surrounding scenery. Perfect clean circular boundary with antialiased edges. Fully opaque within the blue disk, truly transparent everywhere outside it, no painted checkerboard, no external cast shadow. Exact requested output size 1024x1024.


## 矢量版与导出

已将圆形罗盘图案重绘为真实 SVG 路径、圆与渐变，不包含内嵌位图；保留主要构图，清理生成图片的边缘杂点，细节与原图会略有不同。

- SVG 源文件：`design/icons/tsnav-icon.svg`。
- 同目录 PNG：16、24、32、48、64、96、128、180、192、256、512、1024 像素，全部从该 SVG 渲染，保留圆外透明。
- 同目录 `favicon.ico`：包含 16、32、48 三种尺寸。
- `design/` 继续全部被 Git 忽略，未新增 pnpm 命令或自动生成脚本。

项目实际使用的副本存于 `static/` 并纳入版本控制：

| 路径 | 使用位置 |
| --- | --- |
| `static/favicon.svg` | 现代浏览器 favicon、页头 36px 品牌图标；也是 SVG 的受版本控制副本 |
| `static/favicon.ico` | 传统浏览器 favicon 回退 |
| `static/apple-touch-icon.png` | 180px Apple 触屏图标 |
| `static/branding/icon-192.png` | 192px PNG 图标声明 |
| `static/branding/icon-512.png` | 512px PNG 图标声明 |

上述 PNG / ICO 均使用矢量版渲染，未使用初始 AI 位图缩放。只声明站点图标，不引入 PWA 或离线功能。

需要手动更新时，在设计目录修改 SVG，再通过本机的 librsvg 与 ImageMagick 导出，例如：

```sh
rsvg-convert -w 192 -h 192 design/icons/tsnav-icon.svg -o design/icons/tsnav-icon-192.png
magick design/icons/tsnav-icon-16.png design/icons/tsnav-icon-32.png design/icons/tsnav-icon-48.png design/icons/favicon.ico
```

按上表手动同步运行时副本。全新检出不含 design 文件夹时，可从 `static/favicon.svg` 恢复 SVG 源文件。
