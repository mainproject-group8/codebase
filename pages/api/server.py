import os
import uuid
import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify, send_file, send_from_directory
# from tensorflow.keras.preprocessing.image import load_img, save_img, img_to_array, array_to_img
from flask_cors import CORS
from PIL import Image
import cv2
import charEncode 

UPLOAD_FOLDER = '/Users/devikrishnamk/Desktop/Cropped_Uploads'
ANSWERSHEET_PATH = '/Users/devikrishnamk/Desktop/codebase/pages/api'



#key_list = list(charEncode.character_dictionary.keys())
#val_list = list(charEncode.character_dictionary.values())

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
cors = CORS(app,resources={r"/*":{"origins":"*"}})
# Load the saved model

@app.route('/predict',methods=['POST'])
def upload():

    model =  tf.keras.models.load_model('/Users/devikrishnamk/Desktop/Saves')

    # Get the uploaded image from the request
    image_file = request.files['image']

    # Generate a unique filename for the uploaded image
    answersheet = f'answer_sheet.jpeg'
    
    image_file.save(os.path.join(ANSWERSHEET_PATH, answersheet))

    #answer_path = os.path.join(answersheet_path, answersheet)
    
    print("Running cropping.py")
    fileName = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    img = cv2.imread('answer_sheet.jpeg')
    # print(img.shape)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 11, 17, 17)
    # kernel = np.ones((5, 5), np.uint8)
    # erosion = cv2.erode(gray, kernel, iterations=2)
    # kernel = np.ones((4, 4), np.uint8)
    # dilation = cv2.dilate(erosion, kernel, iterations=2)

    edged = cv2.Canny(gray, 30, 200)

    contours, hierarchy = cv2.findContours(
        edged, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    print(len(contours))
    rects = [cv2.boundingRect(cnt) for cnt in contours]
    rects = sorted(rects, key=lambda x: x[1])
    j = 0
    i = 0
    k = 0
    dict1 = {}
    flag = 0
    for rect in rects:
        x, y, w, h = rect
        area = w * h
        if (area == 2401 and flag == 0):
            #print(x, y)
            flag = 1
            if (y not in dict1):
                dict1[y] = k
                k += 1
            out = img[y+10:y+h-10, x+10:x+w-10]
            cropped_filename = 'cropped\\' + fileName[dict1[y]] + '_' + str(j) + '.jpg'
            file_path = os.path.join(UPLOAD_FOLDER, cropped_filename)
            cv2.imwrite(file_path, out)
            j += 1
            i += 1
        else:
            flag = 0
    
    prediction_array = []
    for file in os.listdir(UPLOAD_FOLDER):
        if (file.endswith('.jpg')):
            image_path = os.path.join(UPLOAD_FOLDER, file)
            image = Image.open(image_path)

            image = image.resize((128, 128))
            image_array = np.array(image)
            image_array = image_array / 255.0
            image_array = np.expand_dims(image_array, axis=0)

            prediction = model.predict(image_array)
            prediction = np.argmax(prediction)
            position = charEncode.val_list.index(str(prediction))
            letter = charEncode.key_list[position]
            prediction_array.append(letter)
    
    
    
    

    # Save the image to disk
    #image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    #file_image = Image.open(os.path.join(app.config['UPLOAD_FOLDER'], filename)).resize((128,128))

    #image_array = (np.array(file_image)/255.0).reshape(1,128,128,3)



    # # Run the model on the image
    #prediction = model.predict(image_array)
    #prediction = np.argmax(prediction)




    # Return the URL of the saved image as a JSON response
    # Convert the prediction to a string and send it back as a JSON response
    return jsonify({'url': f'/images/{answersheet}',
                    'prediction': str(prediction_array)})

# Define a Flask endpoint for serving uploaded images
@app.route('/images/<path:filename>')
def serve_image(filename):  
    return send_from_directory(ANSWERSHEET_PATH, filename)




if __name__=="__main__":
    app.run(debug=True)
    