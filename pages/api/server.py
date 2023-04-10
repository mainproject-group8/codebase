import os
import tensorflow as tf
from flask import Flask, request, jsonify, send_file, send_from_directory
from tensorflow.keras.preprocessing.image import load_img, save_img, img_to_array, array_to_img
from flask_cors import CORS
import cv2

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__),'../../images/letters')
ANSWERSHEET_PATH = os.path.join(os.path.dirname(__file__),'../../images')



#key_list = list(charEncode.character_dictionary.keys())
#val_list = list(charEncode.character_dictionary.values())

# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# cors = CORS(app,resources={r"/*":{"origins":"*"}})
# Load the saved model

@app.route('/predict',methods=['GET','POST'])
def upload():
    # model =  tf.keras.models.load_model('/Users/devikrishnamk/Desktop/Saves'
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

    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    # img = cv2.imread('answer_sheet.jpeg')
    # print(img.shape)
    # gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # gray = cv2.bilateralFilter(gray, 11, 17, 17)
    # kernel = np.ones((5, 5), np.uint8)
    # erosion = cv2.erode(gray, kernel, iterations=2)
    # kernel = np.ones((4, 4), np.uint8)
    # dilation = cv2.dilate(erosion, kernel, iterations=2)

    # edged = cv2.Canny(gray, 30, 200)

    # contours, hierarchy = cv2.findContours(
    #     edged, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    # print(len(contours))
    # rects = [cv2.boundingRect(cnt) for cnt in contours]
    # rects = sorted(rects, key=lambda x: x[1])
    # j = 0
    # i = 0
    # k = 0
    # dict1 = {}
    # flag = 0
    # for rect in rects:
    #     x, y, w, h = rect
    #     area = w * h
    #     if (area == 2401 and flag == 0):
    #         #print(x, y)
    #         flag = 1
    #         if (y not in dict1):
    #             dict1[y] = k
    #             k += 1
    #         out = img[y+10:y+h-10, x+10:x+w-10]
    #         cropped_filename = 'cropped\\' + fileName[dict1[y]] + '_' + str(j) + '.jpg'
    #         file_path = os.path.join(UPLOAD_FOLDER, cropped_filename)
    #         cv2.imwrite(file_path, out)
    #         j += 1
    #         i += 1
    #     else:
    #         flag = 0
    
    # prediction_array = []
    # for file in os.listdir(UPLOAD_FOLDER):
    #     if (file.endswith('.jpg')):
    #         image_path = os.path.join(UPLOAD_FOLDER, file)
    #         image = Image.open(image_path)
#         image = image.resize((128, 128))
    #         image_array = np.array(image)
    #         image_array = image_array / 255.0
    #         image_array = np.expand_dims(image_array, axis=0)

    #         prediction = model.predict(image_array)
    #         prediction = np.argmax(prediction)
    #         position = charEncode.val_list.index(str(prediction))
    #         letter = charEncode.key_list[position]
    #         prediction_array.append(letter)
    
    
    
    

    # Save the image to disk
    #image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    #file_image = Image.open(os.path.join(app.config['UPLOAD_FOLDER'], filename)).resize((128,128))

    #image_array = (np.array(file_image)/255.0).reshape(1,128,128,3)



    # # Run the model on the image
    #prediction = model.predict(image_array)
    #prediction = np.argmax(prediction)

    t_g = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255)
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