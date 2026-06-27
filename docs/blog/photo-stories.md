Title: How I create photo stories from my travel.
Date: 2020-06-15
Slug: photo-stories
Image: images/photos-cover.jpg
Summary: I created a new Photos page on my website, where I will share photo stories from my travel. I create these stories with my own open-source tool called Simple Photo Gallery. I will also post links to my photo collections on the amazing website for free images called Unsplash.

{% from 'macros.j2' import vote, image, subscription_form %}

It will be a shorter post today, because I'm busy working on a new and exciting project. I will be able to share it with you very soon!

I created a new [Photos page](https://old.haltakov.net/photos/) on my website, where I will share photo stories from my travel. I will also post links to my photo collections on the amazing website for free images called [Unsplash](https://unsplash.com/). Read below for more details how I create the photo stories and why I decided to share all my photos for free.

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <div>
    <a href="https://old.haltakov.net/photos/"><img class="m-2 image-750" src="/images/photos-photos-page.jpg" alt="Photos from Vladimir Haltakov"></a>
    <p class="text-center">The Photos pages on my website</p>
  </div>
</div>

## Travel photos

I'm by no means a professional photographer. However, I put a lot of effort in the photos from my trips and I think I get some not so bad results. When travelling, I usually take the following equipment with me:

- [Nikon D5500](https://www.dxomark.com/nikon-d5500-sensor-review-low-noise-and-class-leading-dynamic-range/) with a [Tamron 16-300mm f/3.5-6.3](https://www.dxomark.com/tamron-16-300mm-f-3-5-6-3-di-ii-vc-pzd-macro-review-jack-of-all-trades-part-i-nikon-mount/) zoom lens,
- iPhone XS,
- [DJI Osmo Action](https://www.dji.com/en/osmo-action) camera,
- [DJI Spark](https://www.dji.com/en/spark) drone.

The Tamron lens may not be super sharp, but the big zoom is very handy while traveling, because I don't have to switch lenses. The cameras on the latest iPhones are now so good, that photos from my iPhone XS now also regularly land in my best photos. I like to use an action camera (I had a GoPro HERO3 before the Osmo) to record while driving, in the water or when hiking {{ vote('haltakov', 'haltakovnet', 'action-camera') }}. Unfortunately, many places, like for example national parks, don't allow flying a drone, so I don't always take the Spark with me.

On a 3 week trip, I normally shoot somewhat around 6000 photos. I will then spend quite some time choosing the best photos and editing them in Lightroom (I always shoot RAW). I have a quite efficient organization and editing workflow by now {{ vote('haltakov', 'haltakovnet', 'photo-workflow') }}. In the end, I combine the photos from the different devices in a way that I can tell the story of the trip.

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <div>
    <a href="/images/photos-equipment.jpg"><img class="m-2 image-500" src="/images/photos-equipment.jpg" alt="Photo equipment of Vladimir Haltakov"></a>
    <p class="text-center">Photo and video equipment for a weekend getaway in the Austrian Alps.</p>
  </div>
</div>

## Creating photo stories

I tried many ways of sharing travel photos with friends and family, but I didn't like any of the existing services. I tried Amazon Photos, Google Photos, Facebook, iCloud, Flickr and OneDrive, but none of them was what I wanted. Such photo hosting sites are good if you want to dump a bunch of photos sorted by date. However, I never found a way, to organize and describe the photos in a way that I can create a story. So, I built my own tool...

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <div>
    <a href="https://old.haltakov.net/simple-photo-gallery/gallery_usa_multi/"><img class="m-2 image-750" src="/images/photos-simple-photo-gallery.jpg" alt="Photo story from our trip through California created with Simple Photo Gallery"></a>
    <p class="text-center">Photo story from our trip through California created with Simple Photo Gallery</p>
  </div>
</div>

Some time ago, I started writing Python scripts to organize my photos and to generate static HTML galleries from them. Earlier this year, I decided to clean up all the code and publish it as an open-source Python tool, called [Simple Photo Gallery](https://pypi.org/project/simple-photo-gallery/) {{ vote('haltakov', 'haltakovnet', 'open-sourcing-spg') }}. The package is published on [PyPi](https://pypi.org/project/simple-photo-gallery/) and the code is hosted on [GitHub](https://github.com/haltakov/simple-photo-gallery). My idea was that if these scripts are useful to me, they may be useful to other people as well. And it seems I was not completely wrong...

<blockquote class="twitter-tweet"><p lang="en" dir="ltr"><a href="https://twitter.com/haltakov?ref_src=twsrc%5Etfw">@haltakov</a> Hi Vladimir, I&#39;ve just come across your simple photo gallery and it&#39;s amazing! I have two feature requests if possible! 1) Could we get the date of the photo displayed at the bottom near the description</p>&mdash; Dan (@danwri) <a href="https://twitter.com/danwri/status/1270704041929179136?ref_src=twsrc%5Etfw">June 10, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I use Simple Photo Gallery to create the photo stories that I publish on my [Photos page](https://old.haltakov.net/photos/). Check out the [example gallery](https://old.haltakov.net/simple-photo-gallery/gallery_usa_multi/) from our trip through California in 2019. Using the tool it is very easy to split the photos according to the different stages of the trip. You can then add some descriptions to each section that combines several photos. You can also write individual caption for each photo that is displayed when you open it. Since the generated gallery consists of static HTML, CSS and JavaScript files, the hosting is easy and very cheap (even free for smaller galleries). I host my website and my galleries on [Netlify](https://www.netlify.com/), while the photos are hosted on [Amazon S3](https://aws.amazon.com/s3/) (with [CloudFront](https://aws.amazon.com/cloudfront/) as a CDN) {{ vote('haltakov', 'haltakovnet', 'hosting-setup') }}.

I actually have more of these stories, but I keep some of them private and only share them with friends and family. I avoid posting photos of my wife and (especially) my son publicly.

## Sharing my photos for free on Unsplash

Recently, I started sharing my best photos on [Unsplash](https://unsplash.com/@haltakov). Unsplash is an amazing website offering a huge selection of high-quality photos that anybody can use for free. They have a very interesting [story](https://unsplash.com/history) and [business model](https://medium.com/unsplash/introducing-unsplash-for-brands-3b60d1b4ad0c), which I highly recommend you to read. There are already many websites that allow you to use Unsplash images, like for example Trello, Figma or Squarespace, so you may already have been using Unsplash.

So, why did I decide to share all my photos there? I have many images that are just sitting on my hard disk (and backed up in the cloud of course). What is the point keeping them to myself? Maybe they will be useful to some people, as photos from others are useful to me, when I use them on Trello? I wanted to support the great Unsplash community so I decided to start contributing my photos there as well. And it seems that some people like my photos and are downloading them! The photos from our trips in California and Australia had about 300.000 views and 3500 downloads in the last 30 days.

<div class="d-md-flex justify-content-center flex-wrap my-4">
  <div>
    <a href="/images/photos-unsplash-stats.jpg"><img class="m-2 image-750" src="/images/photos-unsplash-stats.jpg" alt="Unsplash stats for Vladimir Haltakov"></a>
    <p class="text-center">Statistics for my Unsplash profile for the past 30 days.</p>
  </div>
</div>

## More photos

I will continue publishing photo stories from my past and future trips on my website and also share them on Unsplash. I have quite some photos from our trips to Japan {{ vote('haltakov', 'haltakovnet', 'trip-japan') }}, Brazil {{ vote('haltakov', 'haltakovnet', 'trip-brazil') }}, Portugal {{ vote('haltakov', 'haltakovnet', 'trip-portugal') }}, Italy {{ vote('haltakov', 'haltakovnet', 'trip-italy') }}, Madeira {{ vote('haltakov', 'haltakovnet', 'trip-madeira') }}, Israel {{ vote('haltakov', 'haltakovnet', 'trip-israel') }} and many more. So, make sure to subscribe to my newsletter below or follow me on [Unsplash](https://unsplash.com/@haltakov) or on [Twitter](https://twitter.com/haltakov) and I will let you know when I have something new to share.

<div class="row my-5 justify-content-md-center">
  <div class="col-md-5">
    <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
      <div class="col px-3 pt-3 pb-1 d-flex flex-column position-static text-center">
        <form class="" action="https://tinyletter.com/haltakov" method="post" target="popupwindow" onsubmit="window.open('https://tinyletter.com/haltakov', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true">
          <div class="form-group">
            <h5 class="mb-4">Subscribe to my newsletter</h5>

            <p>I write once per week about technology, travel and photography. Sometimes all of them mixed together...</p>
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

If you like the article or have comments, please like, retweet or reply [on Twitter](https://twitter.com/haltakov/status/1272626576333705224?s=20) or send me a message. If you like my writing, please [follow me](https://twitter.com/haltakov) or subscribe to my [RSS feed](https://old.haltakov.net/feeds/all.rss.xml). I plan to write more on similar topics in the future.
