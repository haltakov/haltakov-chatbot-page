# Simple Photo Gallery Project Summary

## 1\. Motivation and Problem

* The project originated from the desire to create online photo galleries for travel stories, allowing for sharing with friends/family and personal record-keeping.  
* Existing solutions (e.g., Google Photos, OneDrive, Flickr) were found lacking:  
  * Some were buggy or had "weird features" (e.g., OneDrive's full-screen photo viewing issues and lack of swipe).  
  * User experience was not optimized for storytelling.  
  * Lacked flexibility to add detailed descriptions to individual photos or groups of photos (e.g., grouping by city visited).

## 2\. Simple Photo Gallery (Version 1\)

### 2.1. Overview

* A Python-based, command-line tool (CLI) created to address the identified needs.  
* Installed via PIP.  
* Generates static HTML, JavaScript, and CSS files, along with processed images.

### 2.2. How it Works

* Users prepare photos in a folder.  
* The `gpg build` command is used to create and configure the gallery.  
* Configuration is done through JSON files, allowing users to:  
  * Add descriptions to photos (sourced from photo metadata/labels, e.g., from Lightroom, or manually entered).  
  * Group photos (e.g., by topic or city).  
  * Add descriptions for groups of photos.  
  * Define a header image and header text/titles.

### 2.3. Key Features

* **Storytelling Focus:** Designed to add narrative context to photos.  
* **Lightbox:** Includes a well-designed lightbox library for viewing photos, optimized for both mobile and desktop.  
* **Video Support:** The lightbox library was extended to support videos.  
* **Static Site Generation:** Produces a self-contained static website.  
* **Self-Hosting:** Easy to host on various platforms like Vercel, Netlify, GitHub Pages, Cloudflare Pages.  
* **No Hosting Service:** The tool itself does not provide hosting.

### 2.4. Usage

* Initially created for personal travel galleries.  
* Allows sharing a link with friends and family to view galleries with photos grouped by topic, additional information for groups, and labels for each photo/video.

## 3\. Adoption and Community

### 3.1. Open Source and Reception

* Launched as an open-source project on GitHub.  
* A simple landing page was created.  
* The tool has gained considerable usage.  
* Positive feedback observed, including unprompted posts on Reddit recommending the project.

### 3.2. Attribution and Discovery

* Generated galleries include a small, removable "created by Simple Photo Gallery" link at the bottom.  
* Many users keep this link, which has helped discover various use cases by searching for this phrase on Google.  
* **Diverse Uses:**  
  * Personal photo hosting.  
  * Professional websites to showcase products.

### 3.3. Maintenance and Development

* Development on the Python version has slowed over the past 2-3 years due to the creator's limited time.  
* A community member is now helping maintain the Python project by fixing bugs and adding testing features.

### 3.4. Challenges of Version 1

* The tool is technically demanding:  
  * Requires CLI usage.  
  * Involves editing JSON configuration files.  
* Despite the technical barrier, its adoption indicates it provides significant value.

## 4\. Future Plans (Version 2\)

### 4.1. Technical Rewrite

* Plan to rewrite the entire tool in JavaScript, using React to create a static app.  
* **Goal:** Increase flexibility and make it easier to add new features.

### 4.2. Visual Editor

* A visual editor for managing photos and labels is planned.  
* **Goal:** Eliminate the need for manual JSON file editing, making the tool more user-friendly.

### 4.3. Hosting Service

* Intention to offer an optional hosting service for a small fee.  
* Users would be able to use the editor online and host their galleries through this service if they prefer not to self-host.

### 4.4. Encryption Features

* Plan to add encryption features:  
  * Password protection for galleries.  
  * Actual encryption of photos, with decryption occurring in the browser.  
  * **Goal:** Enhance privacy for sharing sensitive photos.

