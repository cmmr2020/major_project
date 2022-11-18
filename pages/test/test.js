Page({
  data: {
    imgsrc: '',
    canvas: null,
    ctx: null,
    imgsrc2:''
  },
  // 在页面初次渲染完成生命周期获取操作canvas的上下文对象
  onReady() {
    const query = wx.createSelectorQuery()
    query.select('#Canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        this.setData({ canvas, ctx })
      })
  },
  // 选择图片
  async chooseImages() {
    const res = await wx.chooseImage({})
    const addWatermarkRes = await this.addWatermark(res.tempFilePaths[0])
  },
    // 选择图片
    async chooseImages2() {
      const res = await wx.chooseImage({})
      this.data.imgsrc2=res.tempFilePaths[0]
      //const addWatermarkRes = await this.addWatermark(res.tempFilePaths[0])
    },
  // 添加水印方法 (传入图片地址)
  addWatermark(tempFilePath) {
    return new Promise( async (resolve, reject) => {
        // 获取图片信息
        const imgInfo = await wx.getImageInfo({ src: tempFilePath })
        // 获取图片信息
        const imgInfo2 = await wx.getImageInfo({ src: this.data.imgsrc2 })
        console.log(imgInfo)
        // 设置canvas宽高
        this.data.canvas.width = imgInfo.width
        this.data.canvas.height = imgInfo.height
        // 创建一个图片对象
        const image = this.data.canvas.createImage();
        image.src = tempFilePath;
        image.onload = () => {
          // 将图片绘制到canvas上
          this.data.ctx.drawImage(image, 0, 0, imgInfo.width, imgInfo.height)
          //this.data.ctx.drawImage(imgInfo2, 0, 0, 100, imgInfo.height)
          // 设置文字字号及字体
          this.data.ctx.font = imgInfo.height*0.05 +'px sans-serif'
          // 设置画笔颜色
          this.data.ctx.fillStyle = 'red';
          //设置透明度
          this.data.ctx.globalAlpha = 0.5
          // 填入文字  文本,绘制文本的左上角 x 坐标位置,绘制文本的左上角 y 坐标位置,需要绘制的最大宽度，可选
          //从下到上
          this.data.ctx.fillText('4.单价: 20元', imgInfo.width*0.05, imgInfo.height*0.98,imgInfo.width*0.9)
          this.data.ctx.fillText('3.品名: 巨无霸汉堡巨无霸汉堡巨无霸汉堡巨无霸汉堡巨无霸汉堡', imgInfo.width*0.05, imgInfo.height*0.9,imgInfo.width*0.9)
          this.data.ctx.fillText('2.单价: 20元', imgInfo.width*0.05, imgInfo.height*0.82,imgInfo.width*0.9)
          this.data.ctx.fillText('1.品名: 巨无霸汉堡巨无霸汉堡巨无霸汉堡巨无霸汉堡巨无霸汉堡', imgInfo.width*0.05, imgInfo.height*0.74,imgInfo.width*0.9)
  
          // 将canvas转为为图片
          wx.canvasToTempFilePath({
            canvas: this.data.canvas,
            success: (res) => {
              this.setData({ imgsrc: res.tempFilePath})
              resolve(res.tempFilePath)
            },
          })
        }
    })
  },
  // 预览图片
  prevImage(){
    wx.previewImage({
      current: this.data.imgsrc, // 当前显示图片的http链接
      urls: [this.data.imgsrc] // 需要预览的图片http链接列表
    })
  }
})