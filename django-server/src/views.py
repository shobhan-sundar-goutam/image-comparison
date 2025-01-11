from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from skimage.metrics import structural_similarity
from skimage.transform import resize
import cv2
import numpy as np

class CompareAPIView(APIView):
    def post(self, request, *args, **kwargs):
        def orb_similarity_check(img1, img2):
            orb = cv2.ORB_create()

            # detect keypoints and descriptors  
            kp_a, desc_a = orb.detectAndCompute(img1, None)
            kp_b, desc_b = orb.detectAndCompute(img2, None)
            
            # define the bruteforce matcher object
            bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

            # perform matches
            matches = bf.match(desc_a, desc_b)

            #Look for similar regions with distance < 50. Goes from 0 to 100 so pick a number between
            similar_regions = [i for i in matches if i.distance < 50]
            if len(matches) == 0: 
                return 0
            
            return round(((len(similar_regions) / len(matches)) * 100), 2)
        
        def structural_similarity_check(img1, img2):
            sim, diff = structural_similarity(img1, img2, full=True, data_range=1.0)
            return round(sim * 100, 2)
        
        file1 = request.FILES.get('image1')
        file2 = request.FILES.get('image2')

        if not file1 or not file2:
            return Response({"error": "Invalid image files."}, status=status.HTTP_400_BAD_REQUEST)

        # Convert uploaded images to numpy arrays
        img1 = cv2.imdecode(np.frombuffer(file1.read(), np.uint8), cv2.IMREAD_GRAYSCALE)
        img2 = cv2.imdecode(np.frombuffer(file2.read(), np.uint8), cv2.IMREAD_GRAYSCALE)

        if img1 is None or img2 is None:
            return Response({"error": "Invalid image files."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Resizing img2
        img2_resized = resize(img2, (img1.shape[0], img1.shape[1]), anti_aliasing=True, preserve_range=True).astype('uint8')

        # Compute ORB similarity
        orb_similarity = orb_similarity_check(img1, img2_resized)
        
        # Compute SSIM similarity
        ssim_similarity = structural_similarity_check(img1, img2_resized)

        return Response({
            "orb_similarity": orb_similarity,
            "ssim_similarity": ssim_similarity
        }, status=status.HTTP_200_OK)