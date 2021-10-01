import sys
from tensorflow.keras.models import load_model
model = load_model(
    'C:\\Users\\Huzaifa Sohail\\OneDrive\\Desktop\\Project UI\\project-backend\\models\\model.h5')

result = model.predict(
    [[float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])]])

print([result[0][0], result[0][1], result[0][2]])
