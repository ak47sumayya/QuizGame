from flask import Flask, render_template, request, session, redirect, url_for

app = Flask(__name__)
app.secret_key = 'quiz_master_secret_key_2024'

# Quiz Data - 6 Categories with 8 Questions Each
QUIZ_DATA = {
    'History': [
        {'question': 'When did World War II end?', 'options': ['1943', '1944', '1945', '1946'], 'correct': 2},
        {'question': 'Who was the first President of the United States?', 'options': ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'], 'correct': 1},
        {'question': 'In which year did the Titanic sink?', 'options': ['1910', '1911', '1912', '1913'], 'correct': 2},
        {'question': 'Who built the Taj Mahal?', 'options': ['Akbar', 'Shah Jahan', 'Aurangzeb', 'Babur'], 'correct': 1},
        {'question': 'When did Pakistan gain independence?', 'options': ['1945', '1946', '1947', '1948'], 'correct': 2},
        {'question': 'Who was the first Caliph of Islam?', 'options': ['Hazrat Umar', 'Hazrat Abu Bakr', 'Hazrat Usman', 'Hazrat Ali'], 'correct': 1},
        {'question': 'In which year did World War I begin?', 'options': ['1912', '1914', '1916', '1918'], 'correct': 1},
        {'question': 'Who discovered America?', 'options': ['Vasco da Gama', 'Christopher Columbus', 'Ferdinand Magellan', 'Marco Polo'], 'correct': 1}
    ],
    'General Knowledge': [
        {'question': 'What is the capital of France?', 'options': ['London', 'Berlin', 'Paris', 'Madrid'], 'correct': 2},
        {'question': 'How many continents are there?', 'options': ['5', '6', '7', '8'], 'correct': 2},
        {'question': 'What is the largest ocean?', 'options': ['Atlantic', 'Indian', 'Arctic', 'Pacific'], 'correct': 3},
        {'question': 'Which planet is known as the Red Planet?', 'options': ['Venus', 'Mars', 'Jupiter', 'Saturn'], 'correct': 1},
        {'question': 'What is the tallest mountain in the world?', 'options': ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'], 'correct': 2},
        {'question': 'How many days are in a leap year?', 'options': ['364', '365', '366', '367'], 'correct': 2},
        {'question': 'What is the currency of Japan?', 'options': ['Yuan', 'Won', 'Yen', 'Rupee'], 'correct': 2},
        {'question': 'Which is the largest country by area?', 'options': ['Canada', 'China', 'USA', 'Russia'], 'correct': 3}
    ],
    'Science': [
        {'question': 'What is the chemical symbol for water?', 'options': ['H2O', 'CO2', 'O2', 'N2'], 'correct': 0},
        {'question': 'What is the speed of light?', 'options': ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'], 'correct': 0},
        {'question': 'What organ pumps blood through the body?', 'options': ['Liver', 'Kidney', 'Heart', 'Lungs'], 'correct': 2},
        {'question': 'How many bones are in the human body?', 'options': ['196', '206', '216', '226'], 'correct': 1},
        {'question': 'What gas do plants absorb from the atmosphere?', 'options': ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], 'correct': 2},
        {'question': 'What is the powerhouse of the cell?', 'options': ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], 'correct': 1},
        {'question': 'What is the boiling point of water?', 'options': ['90°C', '100°C', '110°C', '120°C'], 'correct': 1},
        {'question': 'Which vitamin is produced by the sun?', 'options': ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], 'correct': 3}
    ],
    'Technology': [
        {'question': 'Who founded Microsoft?', 'options': ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Elon Musk'], 'correct': 1},
        {'question': 'What does CPU stand for?', 'options': ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Computer Processing Unit'], 'correct': 0},
        {'question': 'In what year was the first iPhone released?', 'options': ['2005', '2006', '2007', '2008'], 'correct': 2},
        {'question': 'What does HTML stand for?', 'options': ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'], 'correct': 0},
        {'question': 'Who is known as the father of computers?', 'options': ['Bill Gates', 'Steve Jobs', 'Charles Babbage', 'Alan Turing'], 'correct': 2},
        {'question': 'What does USB stand for?', 'options': ['Universal Serial Bus', 'United Serial Bus', 'Universal System Bus', 'United System Bus'], 'correct': 0},
        {'question': 'Which company developed Android?', 'options': ['Apple', 'Microsoft', 'Google', 'Samsung'], 'correct': 2},
        {'question': 'What is the full form of WiFi?', 'options': ['Wireless Fidelity', 'Wireless Function', 'Wide Fidelity', 'Wire Fidelity'], 'correct': 0}
    ],
    'Sports': [
        {'question': 'How many players are on a soccer team?', 'options': ['9', '10', '11', '12'], 'correct': 2},
        {'question': 'In which sport is the term "love" used?', 'options': ['Cricket', 'Tennis', 'Golf', 'Baseball'], 'correct': 1},
        {'question': 'How many rings are on the Olympic flag?', 'options': ['4', '5', '6', '7'], 'correct': 1},
        {'question': 'What is the national sport of Pakistan?', 'options': ['Cricket', 'Hockey', 'Squash', 'Football'], 'correct': 1},
        {'question': 'How long is a marathon?', 'options': ['26.2 miles', '20 miles', '30 miles', '25 miles'], 'correct': 0},
        {'question': 'In which sport would you perform a slam dunk?', 'options': ['Volleyball', 'Basketball', 'Football', 'Tennis'], 'correct': 1},
        {'question': 'How many Grand Slam tournaments are in tennis?', 'options': ['2', '3', '4', '5'], 'correct': 2},
        {'question': 'What color card is shown for a sending-off?', 'options': ['Yellow', 'Red', 'Green', 'Blue'], 'correct': 1}
    ],
    'Mathematics': [
        {'question': 'What is 15 × 8?', 'options': ['110', '120', '125', '130'], 'correct': 1},
        {'question': 'What is the value of π (pi)?', 'options': ['2.14', '3.14', '4.14', '5.14'], 'correct': 1},
        {'question': 'What is the square root of 144?', 'options': ['10', '11', '12', '13'], 'correct': 2},
        {'question': 'What is 25% of 200?', 'options': ['25', '50', '75', '100'], 'correct': 1},
        {'question': 'How many sides does a hexagon have?', 'options': ['5', '6', '7', '8'], 'correct': 1},
        {'question': 'What is 2³ (2 to the power of 3)?', 'options': ['6', '8', '9', '12'], 'correct': 1},
        {'question': 'What is the sum of angles in a triangle?', 'options': ['90°', '180°', '270°', '360°'], 'correct': 1},
        {'question': 'What is 1/2 + 1/4?', 'options': ['1/2', '2/3', '3/4', '1'], 'correct': 2}
    ]
}

@app.route('/')
def index():
    session.clear()
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start():
    username = request.form.get('username')
    if username:
        session['username'] = username
        return redirect(url_for('categories'))
    return redirect(url_for('index'))

@app.route('/categories')
def categories():
    if 'username' not in session:
        return redirect(url_for('index'))
    return render_template('categories.html', username=session['username'])

@app.route('/quiz/<category>')
def quiz(category):
    if 'username' not in session:
        return redirect(url_for('index'))
    
    if category not in QUIZ_DATA:
        return redirect(url_for('categories'))
    
    session['category'] = category
    session['current_question'] = 0
    session['score'] = 0
    session['answers'] = []
    
    questions = QUIZ_DATA[category]
    return render_template('quiz.html', 
                         category=category,
                         question=questions[0],
                         question_num=1,
                         total_questions=len(questions))

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    if 'username' not in session or 'category' not in session:
        return redirect(url_for('index'))
    
    category = session['category']
    current_q = session['current_question']
    selected = request.form.get('answer')
    
    if selected:
        selected = int(selected)
        session['answers'].append(selected)
        
        if selected == QUIZ_DATA[category][current_q]['correct']:
            session['score'] = session.get('score', 0) + 1
    
    session['current_question'] = current_q + 1
    
    if session['current_question'] >= len(QUIZ_DATA[category]):
        return redirect(url_for('result'))
    
    questions = QUIZ_DATA[category]
    return render_template('quiz.html',
                         category=category,
                         question=questions[session['current_question']],
                         question_num=session['current_question'] + 1,
                         total_questions=len(questions))

@app.route('/result')
def result():
    if 'username' not in session or 'category' not in session:
        return redirect(url_for('index'))
    
    username = session['username']
    category = session['category']
    score = session.get('score', 0)
    total = len(QUIZ_DATA[category])
    percentage = round((score / total) * 100)
    
    return render_template('result.html',
                         username=username,
                         category=category,
                         score=score,
                         total=total,
                         percentage=percentage)

if __name__ == '__main__':
    app.run(debug=True)