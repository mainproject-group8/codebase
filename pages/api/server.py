import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify, send_file, send_from_directory
from tensorflow.keras.preprocessing.image import load_img, save_img, img_to_array, array_to_img
from flask_cors import CORS
import cv2

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__),'../../images/letters')
ANSWERSHEET_PATH = os.path.join(os.path.dirname(__file__),'../../images')

# Load the saved model

@app.route('/predict',methods=['GET','POST'])
def upload():
    model = tf.keras.models.load_model(os.path.join(os.path.dirname(__file__),'model'))

    # Get the uploaded image from the request
    image_file = request.files['image']

    # Generate a unique filename for the uploaded image
    
    image_file.save(os.path.join(ANSWERSHEET_PATH, 'img.jpeg'))

    
    # print("Running cropping.py")
    # fileName = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    # Load image and convert to grayscale
    img = cv2.imread('camscan.jpg')
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    

    # Apply thresholding to segment the image
    _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

    edged = cv2.Canny(thresh, 30, 200)
    # Find contours in the image
    contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Filter contours to find squares
    squares = []
    for cnt in contours:
        perimeter = cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, 0.02 * perimeter, True)
        area = cv2.contourArea(cnt)
        if len(approx) == 4 and area > 1000:
            squares.append(cnt)

    # Sort squares from left to right
    squares = sorted(squares, key=lambda cnt: cv2.boundingRect(cnt)[0])

    # Extract square regions from image
    for i, cnt in enumerate(squares):
        x, y, w, h = cv2.boundingRect(cnt)
        square_region = gray[y+20:y+h-20, x+20:x+w-20]
        # square_region= cv2.convertScaleAbs(square_region, alpha=2)
        th, square_region= cv2.threshold(square_region, 200, 255, cv2.THRESH_BINARY);
        cv2.imwrite(os.path.join(UPLOAD_FOLDER,'cropped'+str(x)+str(y)+'.jpg'), square_region)
    

    # Save the image to disk
    #image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    #image_array = (np.array(file_image)/255.0).reshape(1,128,128,3)

    t_g = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255)


    for f in os.scandir(os.path.join(ANSWERSHEET_PATH,"letters")):
        img=load_img(f.path, target_size=(128,128))
        img_tensor = img_to_array(img)
        img_batch = np.expand_dims(img_tensor, axis=0)
        augmented_img = t_g.flow(img_batch)
        prediction=model.predict(augmented_img)
        print(f.name,"--------->",np.argmax(prediction,axis=-1))
    






    t_gen = t_g.flow_from_directory(os.path.join(os.path.dirname(__file__),'../..'), classes=['images'], class_mode=None, shuffle=False, target_size=(128, 128))

    preds = model.predict(t_gen)
    preds_cls_idx = preds.argmax(axis=-1)


    # Return the URL of the saved image as a JSON response
    # Convert the prediction to a string and send it back as a JSON response
    return jsonify({'url': os.path.join(os.path.dirname(__file__),'../../images/answersheet.jpeg'),
                    'prediction': preds_cls_idx.tolist()})

# Define a Flask endpoint for serving uploaded images
@app.route('/images/<path:filename>')
def serve_image(filename):  
    return send_from_directory(ANSWERSHEET_PATH, filename)

if __name__=="__main__":
    app.run(debug=True)