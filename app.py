import random
from flask import Flask, render_template, request, session, redirect, url_for

app = Flask(__name__)
app.secret_key = 'quiz_master_secret_key_2026'

# 10 Questions per category with Subscript and Superscript tags
QUIZ_DATA = {
    'History': [
        {'question': 'When did World War II end?', 'options': ['1943', '1944', '1945', '1946'], 'correct': 2},
        {'question': 'Who was the first President of the USA?', 'options': ['Jefferson', 'Washington', 'Adams', 'Franklin'], 'correct': 1},
        {'question': 'In which year did the Titanic sink?', 'options': ['1910', '1911', '1912', '1913'], 'correct': 2},
        {'question': 'Who built the Taj Mahal?', 'options': ['Akbar', 'Shah Jahan', 'Aurangzeb', 'Babur'], 'correct': 1},
        {'question': 'Pakistan independence year?', 'options': ['1945', '1946', '1947', '1948'], 'correct': 2},
        {'question': 'First Caliph of Islam?', 'options': ['Hazrat Umar', 'Hazrat Abu Bakr', 'Hazrat Usman', 'Hazrat Ali'], 'correct': 1},
        {'question': 'World War I begin year?', 'options': ['1912', '1914', '1916', '1918'], 'correct': 1},
        {'question': 'Who discovered America?', 'options': ['Vasco da Gama', 'Columbus', 'Magellan', 'Polo'], 'correct': 1},
        {'question': 'French Revolution year?', 'options': ['1789', '1799', '1809', '1779'], 'correct': 0},
        {'question': 'The Indus Valley Civilization flourished around?', 'options': ['2500 BC', '1500 BC', '3500 BC', '500 BC'], 'correct': 0}
    ],
    'Science': [
        {'question': 'Chemical symbol for water?', 'options': ['H<sub>2</sub>O', 'CO<sub>2</sub>', 'O<sub>2</sub>', 'N<sub>2</sub>'], 'correct': 0},
        {'question': 'Formula for Sulfuric Acid?', 'options': ['HCl', 'H<sub>2</sub>SO<sub>4</sub>', 'HNO<sub>3</sub>', 'NaOH'], 'correct': 1},
        {'question': 'Powerhouse of the cell?', 'options': ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], 'correct': 1},
        {'question': 'Human body bone count?', 'options': ['196', '206', '216', '226'], 'correct': 1},
        {'question': 'Boiling point of water?', 'options': ['90°C', '100°C', '110°C', '120°C'], 'correct': 1},
        {'question': 'Vitamin from Sun?', 'options': ['Vit A', 'Vit B', 'Vit C', 'Vit D'], 'correct': 3},
        {'question': 'Symbol for Glucose?', 'options': ['C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>', 'CH<sub>4</sub>', 'C<sub>2</sub>H<sub>5</sub>OH', 'CO<sub>2</sub>'], 'correct': 0},
        {'question': 'Gas used in fire extinguishers?', 'options': ['O<sub>2</sub>', 'N<sub>2</sub>', 'CO<sub>2</sub>', 'He'], 'correct': 2},
        {'question': 'Speed of light?', 'options': ['300k km/s', '150k km/s', '450k km/s', '600k km/s'], 'correct': 0},
        {'question': 'Main gas in Air?', 'options': ['Oxygen', 'Nitrogen', 'Carbon', 'Argon'], 'correct': 1}
    ],
    'Mathematics': [
        {'question': 'What is 15 × 8?', 'options': ['110', '120', '125', '130'], 'correct': 1},
        {'question': 'Value of π (pi)?', 'options': ['2.14', '3.14', '4.14', '5.14'], 'correct': 1},
        {'question': 'Square root of 144?', 'options': ['10', '11', '12', '13'], 'correct': 2},
        {'question': '25% of 200?', 'options': ['25', '50', '75', '100'], 'correct': 1},
        {'question': 'Sides in a hexagon?', 'options': ['5', '6', '7', '8'], 'correct': 1},
        {'question': 'What is 2<sup>3</sup>?', 'options': ['6', '8', '9', '12'], 'correct': 1},
        {'question': 'Sum of angles in triangle?', 'options': ['90°', '180°', '270°', '360°'], 'correct': 1},
        {'question': 'Solve: x<sup>2</sup> = 49', 'options': ['5', '6', '7', '8'], 'correct': 2},
        {'question': 'What is 10<sup>0</sup>?', 'options': ['0', '1', '10', '100'], 'correct': 1},
        {'question': 'Area of circle formula?', 'options': ['2πr', 'πr<sup>2</sup>', 'πd', 'bh'], 'correct': 1}
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
    if 'username' not in session: return redirect(url_for('index'))
    return render_template('categories.html', username=session['username'])

@app.route('/quiz/<category>')
def quiz(category):
    if 'username' not in session: return redirect(url_for('index'))
    
    if category not in QUIZ_DATA:
        return redirect(url_for('categories'))
    
    # Randomization logic
    all_q = QUIZ_DATA[category].copy()
    random.shuffle(all_q)
    selected_q = all_q[:10] # Pick 10 random
    
    session['category'] = category
    session['quiz_questions'] = selected_q
    session['current_question'] = 0
    session['score'] = 0
    
    return render_template('quiz.html', 
                         category=category,
                         question=selected_q[0],
                         question_num=1,
                         total_questions=len(selected_q))

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    if 'quiz_questions' not in session: return redirect(url_for('index'))
    
    questions = session['quiz_questions']
    idx = session['current_question']
    selected = request.form.get('answer')
    
    if selected is not None:
        if int(selected) == questions[idx]['correct']:
            session['score'] += 1
            
    session['current_question'] += 1
    
    if session['current_question'] >= len(questions):
        return redirect(url_for('result'))
    
    next_idx = session['current_question']
    return render_template('quiz.html',
                         category=session['category'],
                         question=questions[next_idx],
                         question_num=next_idx + 1,
                         total_questions=len(questions))

@app.route('/result')
def result():
    if 'username' not in session: return redirect(url_for('index'))
    score = session.get('score', 0)
    total = 10
    percentage = round((score / total) * 100)
    return render_template('result.html', username=session['username'], 
                           score=score, total=total, percentage=percentage, 
                           category=session['category'])

if __name__ == '__main__':
    app.run(debug=True)