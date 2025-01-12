# Image Comparison app

Hi there! 👋 I'm Shobhan Sundar Goutam. This application is designed to compare two images by analyzing them pixel by pixel. When the similarity between the two images reaches or exceeds 90%, we consider them similar. If not, they are deemed different. Simple and effective for ensuring image consistency!

> There are two backends, one is in Node.js(`cd server`) and the other one is in Django(`cd django-server`).
> Django is the most updated one with more features.

<br>

### Django code overview

---

🔍 Two methods of similarity check:

1. Structural similarity (SSIM) using "scikit-image" library.
2. ORB similarity using "opencv" library.

📊 Structural Similarity (SSIM) compares images by analyzing luminance, contrast, and structure.

🔑The ORB (Oriented FAST and Rotated BRIEF) method is a combination of a key-point detector and a descriptor which are:

1. FAST - Features from Accelerated Segment Test
2. BRIEF - Binary Robust Independent Elementary Features

Basically ORB detects various regions of interest or key-points using FAST and describes these key-points using BRIEF.

The brute force matcher then compares a key point from the first image to all key points in the second for similarity.

Using ORB for profile pic similarity would ensure better accuracy, as pics may be scaled, cropped, or altered.

SSIM might not handle such variations effectively.

Also ORB is computationally efficient compared to SSIM.

- Live Link:- [Image Comaparison app](https://image-comparison.netlify.app)

### Demo videos

#### Django backend

https://github.com/user-attachments/assets/9a59cb26-08b7-498f-bab8-1583db76069e

#### Node.js backend

https://github.com/user-attachments/assets/9426521b-4efa-4478-ac47-b2c4d2510fe0
