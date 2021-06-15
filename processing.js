var model;

async function loadModel()
{
  model = await tf.loadGraphModel('TFJS_NEW_2/model.json');

}


function predictImage(){
  // console.log('processing ..');

  let image = cv.imread(canvas);
  cv.cvtColor(image,image,cv.COLOR_RGBA2GRAY,0);
  cv.threshold(image,image,175,255,cv.THRESH_BINARY);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  // You can try more different parameters
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  let cnt = contours.get(0);
  // You can try more different parameters
  let rect = cv.boundingRect(cnt);

  image = image.roi(rect);

  var height = image.rows;
  var width = image.cols;

  if (height>width){
    height = 28;

    const scaleFactor = image.rows/height;

    width = Math.round(image.cols/scaleFactor);
  }
  else{
    width = 28;
    const scaleFactor = image.cols/width;

    height = Math.round(image.rows/scaleFactor);

  }

  let newSize = new cv.Size(width,height);
  cv.resize(image,image,newSize,0,0,cv.INTER_AREA);

  const LEFT = Math.ceil(2+(28-width)/2);
  const RIGHT = Math.floor(2+(28-width)/2);
  const TOP = Math.ceil(2+(28-height)/2);
  const BOTTOM = Math.floor(2+(28-height)/2);


  // console.log(`top: ${TOP}, bottom: ${BOTTOM} left: ${LEFT} right: ${RIGHT}`);

  const BLACK = new cv.Scalar(0,0,0,0);
  cv.copyMakeBorder(image,image,TOP,BOTTOM,LEFT,RIGHT,cv.BORDER_CONSTANT,BLACK);

  // finding moments (center of mass)
  // cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  // cnt = contours.get(0);
  //
  // const Moments = cv.moments(cnt,false);
  //
  // const cx = Moments.m10/Moments.m00; // mass in the horizontal direc/mass of overall image
  // const cy = Moments.m01/Moments.m00; // mass in the vertical direc/mass of overall image
  //
  // console.log(`MOO: ${Moments.m00} cx: ${cx}  cy: ${cy}`);
  //
  //
  // const X_SHIFT = Math.round(image.cols/2.0 - cx);
  // const Y_SHIFT = Math.round(image.rows/2.0 -cy);
  // const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
  // newSize = new cv.Size(image.cols, image.rows);
  // cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);

  let pixelValues = image.data;
  pixelValues = Float32Array.from(pixelValues);
  // console.log(`${pixelValues}`);
  pixelValues = pixelValues.map(function(items){
    return items/255.0;

  });

  // console.log(`${pixelValues}`);

  const X_val = tf.tensor([pixelValues]);
  // console.log(`Shape of tensor is ${X_val.shape}`);
  // console.log(`data type:  ${X_val.dtype}`);

  const result = model.predict(X_val);
  result.print();
  // console.log(tf.memory());

  const output = result.dataSync()[0];


  // testing Canvas

  // const outCanvas = document.createElement('CANVAS');
  //
  // cv.imshow(outCanvas,image);
  // document.body.appendChild(outCanvas);

  // CLEANUP

  image.delete();
  contours.delete();
  cnt.delete();
  hierarchy.delete();
  // M.delete();
  X_val.dispose();
  result.dispose();


  return output;

}
