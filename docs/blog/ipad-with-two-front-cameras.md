Title: Why Apple should put a second front camera on the iPad?
Date: 2020-05-06
Slug: ipad-with-two-front-cameras
Image: images/ipad-cover.jpg
Summary: Video conferencing on the iPad sucks - put it vertically and other people's videos become smaller. Put it horizontally and you are not looking at the camera anymore. But if Apple would put a second front camera on the bottom of the iPad, you could virtually move the camera in the center of the screen...

{% from 'macros.j2' import vote, image, subscription_form %}

Video conferencing on the iPad kind of sucks - put it vertically and other people's videos become smaller (and they are annoyed as well, because video is vertical). Put it horizontally and you are not looking at the camera anymore, because it is either on your left or on your right. But if Apple would put a second front camera on the bottom of the iPad, you could virtually move the camera in the center of the screen...

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <div>
    <a href="/images/ipad-moving-camera.gif"><img class="m-2 image-480" src="/images/ipad-moving-camera.gif" alt="Moving virtual camera animation"></a>
    <p class="text-center">Simulated virtual camera</p>
  </div>
</div>

### An iPad with two front cameras?

In one of the [recent episodes](https://daringfireball.net/thetalkshow/2020/04/14/ep-282) of The Talk Show [John Gruber](https://twitter.com/gruber) and [Joanna Stern](https://twitter.com/JoannaStern) were talking about how bad laptop webcams are and that there is no good way to use an iPad for video conferencing. I can relate, since now during the COVID-19 isolation I'm using an iPad for the regular Zoom calls of my 1.5 year old son with the other kids from his day care (yes, that's a thing).

This made me think that if there was a second front-facing camera on the bottom of the iPad, you can put it horizontally and get a view from both sides of your face. Then, you can use the parallax effect to render an image from a virtual camera that is in the middle of the iPad - exactly where your eyes are looking! I decided to play around with the idea over the last weekend and made a quick proof-of-concept, that I would say works nicely! Read below for more details on how it is done or check out the code of the prototype on [GitHub](https://github.com/haltakov/ipad-two-front-cameras).

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <div>
    <a href="/images/ipad-left.jpg"><img class="m-2 image-300" src="/images/ipad-left.jpg" alt="Image simulating the left iPad camera"></a>
    <p class="text-center">Real image from the left</p>
  </div>
  <div>
    <a href="/images/ipad-center.jpg"><img class="m-2 image-350" src="/images/ipad-center.jpg" alt="Image simulating a virtual camera at the center of the iPads"></a>
    <p class="text-center">Virtual image rendered from the center</p>
  </div>
  <div>
    <a href="/images/ipad-right.jpg"><img class="m-2 image-300" src="/images/ipad-right.jpg" alt="Image simulating the right iPad camera"></a>
    <p class="text-center">Real image from the right</p>
  </div>
</div>

### How does it work?

The [iPad Pro](https://www.apple.com/ipad/compare/) doesn't have a home button anymore, so there is actually a nice place for a second front camera at the bottom. Below is a mock I created in Photoshop of how it would look like and I think visually the second camera fits quite well. It will probably not be easy to fit it inside the device, because the Lightning connector is below, but I don't think it is impossible.

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <a href="/images/ipad-stereo-camera-arrows.jpg"><img class="m-2 image-750" src="/images/ipad-stereo-camera-arrows.jpg" alt="iPad Pro with two front cameras" style="box-shadow: none;"></a>
</div>

The basic idea is that the two cameras can be used as a stereo pair to create a 3D image, similarly to how Portrait mode works on the back camera. This technology is used by Apple for almost 4 years now. Virtually shifting the camera is a more complicated problem than creating a bokeh effect for Portrait mode, though. Instead of deciding which parts of the image to blur, the 3D image can be used to create a new image from a different point of view - ideally in the middle of the iPad where one would be looking.

To do this we can use the [parallax effect](https://en.wikipedia.org/wiki/Parallax) - when looking at objects from two different cameras, objects that are closer are shifted more between the two images than objects that are further away. You can easily test this yourself (your eyes are very similar to a stereo camera) - try alternating between closing your left eye and closing your right eye. You will see how objects that are closer appear to "move" more between the two views. You can help it by putting a finger 10cm in front of your face, while doing that.

The time of flight sensor used for Face ID also provides a 3D image, so theoretically it can be used for the same purpose as well. The problem is that when we shift the camera sideways, the perspective changes in such a way that parts of the background will be revealed that are hidden by the person holding the iPad in the original image. So, what should be displayed there? Having a second camera allows us to actually see those parts of the background from another view and fill the gaps. This is how the virtual image from the center looks like if we use only the left or only the right camera image. You can see the areas that were occluded in the original image as black "shadows".

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <a href="/images/ipad-shift-left-shadows.jpg"><img class="m-2 image-500" src="/images/ipad-shift-left-shadows.jpg" alt="Shifted left image with shadows"></a>
  <a href="/images/ipad-shift-right-shadows.jpg"><img class="m-2 image-500" src="/images/ipad-shift-right-shadows.jpg" alt="Shifted right image with shadows"></a>
</div>

### How to build a proof-of-concept?

Obviously, I don't have an iPad with two cameras, but it is actually easy to simulate. You can put the iPad horizontally, take a photo and then shift the iPad so that the front camera goes to the position where the second camera would be. So, I asked my wife to help me do the photos on her first-generation iPad Pro, while I was trying to stay as still as possible (if the iPad had two cameras they would take the image at exactly the same time).

Having the photos from both sides of my face, we now need to compute the 3D image of the scene. To do that, we need to first compute the so-called disparity map. The disparity map tells us how much every pixel was shifted between the two views - this shift is called disparity. Given the disparity of a pixel, there is a simple formula to compute its 3D position {{ vote('haltakov', 'haltakovnet', 'stereo-reconstruction') }}, but we actually don't need to do that. The disparity is telling us everything we need to know if we just want to move the camera horizontally! For example, if we want to create a virtual camera in the middle of the two real cameras, we need to shift each pixel by half of the computed disparity and that's it!

Computation of stereo disparity maps is an active research field and nowadays machine learning methods based on deep convolutional neural networks usually deliver the best results {{ vote('haltakov', 'haltakovnet', 'deep-learning-depth') }}. I opened the [KITTI stereo benchmark](http://www.cvlibs.net/datasets/kitti/eval_scene_flow.php?benchmark=stereo) and looked for the highest-ranking method for which there is source code available and chose [GANet](https://github.com/feihuzhang/GANet). Most deep learning algorithms are very computationally intensive, but luckily I could use my workstation from work, which has a NVidia GeForce RTX 2080 graphics card. I computed the disparity maps for both the left and the right image and they look quite good, given that I used a model that is not optimized for faces. You can see them below - brighter color means that the pixel has a high disparity and it is closer to the camera than darker pixels (the real disparity maps are actually 16 bit contain more details than what can be shown here).

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <a href="/images/ipad-disparity-left.jpg"><img class="m-2 image-500" src="/images/ipad-disparity-left.jpg" alt="Disparity map for the left image"></a>
  <a href="/images/ipad-disparity-right.jpg"><img class="m-2 image-500" src="/images/ipad-disparity-right.jpg" alt="Disparity map for the right image"></a>
</div>

Shifting either the left or the right image is not difficult, but since for most pixels we have information from both cameras, it is tricky to decide which one to use. I played around a little bit with different methods, but what seems to work best is to always take one of the cameras whenever possible and use the other just to fill the gaps. You can find all the details in the [code](https://github.com/haltakov/ipad-two-front-cameras) and even play around with it if you wish.

### So, does it make sense?

I think the results are not bad, given that I hacked the prototype in 3 days over the (long) weekend. Now imagine if Apple puts several engineers for a couple of months on the problem... There is a lot of things one can easily improve - better disparity maps from methods that are optimized on faces, more sophisticated combination of the two images, using some face and facial features detection in order to avoid artefacts on the face etc. There could also be other benefits of a second front camera apart from better video conferencing, like for example better front-facing AR or better animoji.

On the other hand, it is a challenge to get high-quality 3D images and virtual camera renderings in real time. In this proof-of-concept it is just processing one image, so speed was not an important issue, but the whole computation would need to be done 30 times per second on the iPad. So the problem is definitely technically challenging. However, which company is better suited to make something like this work than Apple?

<div class="row my-5 justify-content-md-center">
  <div class="col-md-5">
    <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
      <div class="col px-3 pt-3 pb-1 d-flex flex-column position-static text-center">
        <form class="" action="https://tinyletter.com/haltakov" method="post" target="popupwindow" onsubmit="window.open('https://tinyletter.com/haltakov', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true">
          <div class="form-group">
            <h5 class="mb-4">Subscribe to my newsletter</h5>

            <p>I write about technology, travel and photography. You will get my newsletter about once per week.</p>
            <p><input type="text" name="email" id="tlemail" placeholder="E-Mail" class="form-control"></p>

            <input type="hidden" value="1" name="embed"/>
            <input type="submit" class="btn btn-green" value="Subscribe" />
          </div>
          <small class="form-text text-muted text-right"><a href="https://tinyletter.com" target="_blank">powered by TinyLetter</a></small>
        </form>
      </div>
    </div>

  </div>
</div>

---

If you like the article or have comments, please like, retweet or reply [on Twitter](https://twitter.com/haltakov/status/1258126146849382400) or send me a message. If you like my writing, please [follow me](https://twitter.com/haltakov) or subscribe to my [RSS feed](https://old.haltakov.net/feeds/all.rss.xml). I plan to write more on similar topics in the future.
