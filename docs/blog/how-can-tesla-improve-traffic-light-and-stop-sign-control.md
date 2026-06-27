Title: How can Tesla improve traffic light and stop sign control?
Date: 2020-04-28
Slug: how-can-tesla-improve-traffic-light-and-stop-sign-control
Image: images/tesla-cover.jpg
Summary: Tesla recently updated their Autopilot to automatically stop at traffic lights and stop signs. My analysis of the system shows that there are some still systematic problems with the vision system, but there is huge potential for improvement when Tesla extends their HD map. And what a better way to do that than letting all Tesla customers drive around and collect the data.

{% from 'macros.j2' import vote, image, subscription_form %}

Tesla recently [released](https://twitter.com/thirdrowtesla/status/1253768351953764352?s=20) a feature called "Traffic Light and Stop Sign Control" as an update of their Autopilot that enables the car to automatically stop at traffic lights and stop signs. For the beginning, the car stops at any stop sign or traffic light, [even if the light is green](https://www.theverge.com/2020/4/27/21238637/tesla-cars-traffic-light-stop-sign-control-feature-self-driving), requiring manual confirmation from the driver in order to drive through the junction. My analysis of the new feature shows that there are still some systematic problems with camera based detection, but there is huge potential for improvement when Tesla extends their HD map. And what a better way to do that than letting all Tesla customers drive around and collect the data. Read my analysis below for more details and some interesting findings.

### How to analyze Tesla's algorithms?

I [worked 5 years on traffic lights and stop signs detection](https://old.haltakov.net) for [BMW's red light warning function](https://twitter.com/haltakov/status/1221547333965447168) {{ vote('haltakov', 'haltakovnet', 'bmw-red-light-function') }} and I also have written a [paper on the topic](http://campar.in.tum.de/pub/haltakov2015gcpr/haltakov2015gcpr.pdf) during my PhD, so I will try to analyze how Tesla's new feature works. I don't have access to Tesla's internal tools (like in [this video](https://www.youtube.com/watch?v=fKXztwtXaGo)), but Tesla added some pretty cool and [detailed visualization](https://twitter.com/Teslarati/status/1249600509113249794?s=20) of what the car "sees" on the display. I didn't have the chance yet to drive this feature myself and I drive a BMW, not a Tesla, so I looked at some videos on YouTube of people filming their drives. I really liked the videos of [this guy](https://www.youtube.com/channel/UCEXeRAVuZaPiOGnRFd-GiAg/featured) who is doing a great job to film both the display and the road ahead and also looks for interesting situations (every image below is a link to the corresponding video).

The detection of traffic lights and stop signs is likely based on a convolutional neural network ([CNN](https://en.wikipedia.org/wiki/Convolutional_neural_network)) like virtually all computer vision detectors nowadays. This means that we can expect the typical problems of such vision systems, like late or missed detections, false positive detections, wrong classification and wrong distance estimation. While the camera is the only sensor that is able to detect the color of the traffic light, it is interesting to see if Tesla is using their HD map to improve the camera detections or not (yet). So, let's see what we can find out...

### General detection performance

On the first look, both the traffic light detection and the stop sign detection seem to work quite good. For a more accurate evaluation, though, one needs to check much more situations and different environment conditions. One of the videos is recorded in the rain, but actually the worst-case scenario for traffic light detection is a sunny day with low sun in front or behind the car. In the couple of clips I looked at, you can see some small problems like a late detection of a red traffic light and a missed detection of a green arrow light, but they are not relevant to the car's behavior. Flashing yellow lights are also [not detected](https://youtu.be/X6p22znbSUs?t=106) sometimes.

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <a href="https://youtu.be/X6p22znbSUs?t=211"><img class="m-2 image-500" src="/images/tesla-late-red.jpg" alt="Tesla traffic light control late detection red light"></a>
  <a href="https://youtu.be/W3-HNSoxxZk?t=314"><img class="m-2 image-500" src="/images/tesla-miss-green.jpg" alt="Tesla traffic light control missed green light"></a>
</div>

<a name="problem-arrows"></a>
Another problem seems to be that the arrows in the traffic lights are not always classified correctly. You can see one example below where the traffic light is first classified as a red circle and only at closer range as a red arrow. This is understandable for a vision system because the details of the arrows are very small, while the cameras and lenses used in most production cars (including Tesla) don't deliver resolution that is anywhere close to the human eye. Note, that Tesla's [narrow forward camera](https://www.tesla.com/autopilot) should help a lot in this case because it is able to see a smaller portion of the scene in a better resolution, but the problem is still challenging. This problem tells us that Tesla doesn't seem to have a good HD map for traffic lights yet, otherwise they would know from the map that this traffic light has a left arrow and could avoid such issues.

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <a href="https://youtu.be/X6p22znbSUs?t=107"><img class="m-2 image-500" src="/images/tesla-false-classification-1.jpg" alt="Tesla traffic light control red arrow wrong"></a>
  <a href="https://youtu.be/X6p22znbSUs?t=107"><img class="m-2 image-500" src="/images/tesla-false-classification-2.jpg" alt="Tesla traffic light control red arrow correct"></a>
</div>

### Distance to the traffic lights and stop signs and tracking

<a name="problem-distance"></a>
While the general detection seems to be robust, you can find quite a lot of examples where the position of the traffic light is wrong (usually displayed too close). You can see some examples below and also take a look at [this moving stop sign](https://youtu.be/X6p22znbSUs?t=197).

Estimating the distance to an object detected in the camera image is one of the hard computer vision problems. A typical camera projects the 3D world onto a 2D plane effectively losing one dimension. In the case of a forward-facing camera, the information about how far various objects are from it is lost. One can try to reconstruct the distance by using measurements from previous frames (called [Structure from Motion](https://en.wikipedia.org/wiki/Structure_from_Motion)) or from [multiple cameras](https://en.wikipedia.org/wiki/Computer_stereo_vision) (though, the distance between the lenses of the front cameras on the Tesla is too small for accurate measurements), but the process is always error prone. In fact, it can be mathematically proven that the error in the estimated distance for a camera increases quadratically with the distance to the object {{ vote('haltakov', 'haltakovnet', 'distance-estimation-error') }}. A lidar, on the other hand, [measures directly](https://en.wikipedia.org/wiki/Lidar) the time that it takes for the laser beam to hit the object and come back, making it much more accurate. I haven't driven the system yet, but you also see [some reports](https://youtu.be/EDc70_N2DkE?t=108) that the braking behavior is not always very smooth and wrong distance estimation is likely the reason for that.

Elon Musk [doesn't like lidars](https://arstechnica.com/cars/2019/08/elon-musk-says-driverless-cars-dont-need-lidar-experts-arent-so-sure/), but Tesla can improve a lot here using their HD map (and I'm sure they are working on it, but are not ready yet). One can put the exact location of objects like traffic lights, stop signs and stop lines in the map and then (given a good localization of course) get much more accurate distance to the traffic lights or stop lines.

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <a href="https://youtu.be/X6p22znbSUs?t=111"><img class="m-2 image-500" src="/images/tesla-wrong-position-1.jpg" alt="Tesla traffic light control wrong traffic light position"></a>
  <a href="https://youtu.be/W3-HNSoxxZk?t=155"><img class="m-2 image-500" src="/images/tesla-wrong-position-2.jpg" alt="Tesla traffic light control wrong traffic light position"></a>
</div>

Another interesting issue that I noticed three times is that sometimes a single stop sign is detected as two signs. This is likely caused by a "track-loss". Let me explain in more details - in order to estimate the distance to an object (a stop sign in this case), Tesla uses detections from several previous frames and they need to track each object between the frames. If the tracking fails, the algorithm may "think" that the stop sign it saw in the previous frame disappeared (for example because it is hidden by a car) and a new one is detected in the current frame. Since the algorithm "remembers" the position of the lost sign it can still calculate where it is supposed to be and show it on the display, while at the same time the new detection is also displayed. This indicates a problem with the tracking algorithm (especially since it happens so often) and may also be one of the reasons for the problems with the distance estimation.

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <a href="https://youtu.be/EDc70_N2DkE?t=113"><img class="m-2 image-500" src="/images/tesla-double-stop-2.jpg" alt="Tesla stop sign control double detection"></a>
  <a href="https://youtu.be/qu_EuRXAJKA?t=24"><img class="m-2 image-500" src="/images/tesla-double-stop-1.jpg" alt="Tesla stop sign control double detection"></a>
</div>

### Traffic light relevance?

<a name="Relevance"></a>

A self-driving car needs to not only detect all traffic lights, but also to know which one is relevant for it. Currently, I see no indication on the display which traffic light is relevant for which lane and especially which is relevant for the car, but you can clearly see that Tesla is preparing for this, because they already detect the arrows in the traffic lights as well as the arrows on the road. Determining the relevant traffic light purely from the camera detections and without a HD map is a very hard task. Let me give you an example my 1.5-year-old is able to recognize when the traffic lights go from red to green, but he has no idea which is the relevant one. Even adults sometimes have problems figuring out which traffic light is the right one, when driving through unknown, complex junctions. {{ vote('haltakov', 'haltakovnet', 'traffic-light-relevance') }}

Here again, the HD map can help a lot - Tesla can store information about the direction each traffic light is relevant for and then they "just" need to associate the detections from the camera to the map in order to solve the relevance problem.

### How much does Tesla use a HD map?

Tesla definitely has some kind of HD map for the traffic light and stop sign control feature, because it displays the message that it is going to stop for traffic control [very early](https://youtu.be/EDc70_N2DkE?t=275) (at about 180 m before the junction) and even if the traffic light or the sign is [behind the corner](https://youtu.be/EDc70_N2DkE?t=125). There is also an interesting case that can be seen in [this video](https://youtu.be/qu_EuRXAJKA?t=144) - because all traffic lights are obstructed by the truck, at some point the car decides that there is something wrong with this junction and changes the display from stopping for traffic lights to stopping at a junction. This is likely a safeguard in case there is a change on the road that is not yet reflected in the map, like for example, if the traffic lights are removed from the junction.

Having said that, there are multiple problems that could be easily corrected if Tesla had a better HD map:

- Wrong classification of traffic lights with [arrows](#problem-arrows).
- Wrong distance for [some traffic lights](#problem-distance).
- No relevance of traffic lights [displayed](#relevance).
- The distance between the stop line and the stop sign [is not stable](https://youtu.be/X6p22znbSUs?t=197).
- Traffic lights hidden by objects, are not displayed (see below).

The fact that traffic lights hidden by other vehicles (in this case a big truck) are not displayed is also good illustration of the lack of HD map information. A good HD map would contain all traffic lights in the junction so they should show up in the visualization even if they are currently not detected (note that in general, Tesla shows traffic lights for which the color is not yet confirmed).

This and all the issues discussed above, indicates that Tesla still has some work to do building their HD map, but what a better way to do this than letting all their customers drive around and send them the data they need to create, refine and update their HD map. Therefore, there will be a lot of improvements coming not only from a better vision system, but also from a better HD map.

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <a href="https://youtu.be/EDc70_N2DkE?t=113"><img class="m-2 image-1000" src="/images/tesla-occlusion.jpg" alt="Tesla traffic light control hidden traffic light"></a>
</div>

### Rollout to other countries

For now, traffic light and stop sign control is only available in the US, but Tesla is [expected](https://www.teslarati.com/tesla-wide-release-autopilot-traffic-light-and-stop-sign-control-2020-12-6/) to roll it out to other countries as well. While stop signs look similarly around the world with some variations in the text (and with exception of the [Japanese triangular stop signs](https://en.wikipedia.org/wiki/Road_signs_in_Japan#/media/File:Japan_road_sign_330-A.svg) of course), traffic lights look very differently in the different countries. This is especially true when it comes to different arrow shapes - take a look at the image from my collection below (can you also spot the Swiss traffic light with red at the bottom?). And let's not start talking about China's traffic lights... {{ vote('haltakov', 'haltakovnet', 'traffic-light-variance') }}

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <a href="/images/tesla-traffic-lights-worldwide.jpg"><img class="m-2 image-1000" src="/images/tesla-traffic-lights-worldwide.jpg" alt="Traffic lights around the world" style="box-shadow: none;"></a>
</div>

So, a rollout is definitely possible, but Tesla will need a lot of additional training data and a neural network that is able to generalize well, but there is no reason to believe that they won't be able to do it. I'm sure, that all Tesla customers driving around are already collecting the data Tesla needs.

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

If you like the article or have comments, please like, retweet or reply [on Twitter](https://twitter.com/haltakov/status/1255579014057648130?s=20) or send me a message. If you like my writing, please [follow me](https://twitter.com/haltakov) or subscribe to my [RSS feed](https://old.haltakov.net/feeds/all.rss.xml). I plan to write more on similar topics in the future.
