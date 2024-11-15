# pongEngine

Времени мало, пишу коротко и по фактам

## class Game

Хранит в себе все данные о запущеной игре. Принимает в себя одно значение - частоту кадров в миллисекундах.  
Все остальное вложено в этот класс.

## class Wall

Класс для стенок. Новые стенки помещаются в массив <code>this.walls</code> на 164 строке.

    this.walls = [
                new Wall(this.game, `3px`, `100vh`, `-3px`, `0`),
                new Wall(this.game, `3px`, `100vh`, `100vw`, `0`),
                new Wall(this.game, `100vw`, `3px`, `0`, `-3px`),
                new Wall(this.game, `100vw`, `3px`, `0`, `100vh`),

                new Wall(this.game, `10px`, `66vh`, `33vw`, 0),
                new Wall(this.game, `10px`, `66vh`, `66vw`, `34vh`)
            ];

Новый экземпляр класса Wall принимает в себя следующие параметры:

1. this.game - не обращайте внимание, пока не автоматизировал передачу этого объекта (лень).
2. Длина стенки.
3. Высота стенки.
4. Положение по оси X.
5. Положение по оси Y.

ОБРАТИТЕ ВНИМАНИЕ, что первые четыре стенки - это границы экрана. Если их убрать, шарики вылетят за экран.

P.S. Внутри этого класса есть неиспользуемый метод <code>tray()</code>. Если его включить (раскоментировать 24 строку), то все стенки будут липнуть к курсору. Использовал чисто для отладки коллизии, можете поиграться.

## class Balls

Класс для шариков. По аналогии со стенками, новые экземпляры помещаются в массив <code>this.balls</code> на 159 строке (циклом создается сразу 30 штук). Пока никаких параметров не принимает.  

Два главных метода объектов:
1. <code>checkDirection()</code> - проверка направления движения.
2. <code>move()</code> - непосредственно перемещение.
3. <code>getRandomRange()</code> - получение случайного значения в диапазоне (используется для рандомизации направления отскока, чтобы траектория не зациклилась).
4. <code>recursiveCheckWalls()</code> - рекурсивная функция, которая проверяет, не наткнулся ли экзмепляр на одну из стен.

## startInterval и stopInterval

Методы класса Game, которые запускают и останавливают интервал. Эти два метода подвязаны к 176-181 строкам. Это нужно было, чтобы при сворачивании окна интервал "ставился на паузу" и скрипт не грузил комп.

Можете поиграться с кодом, понадобавлять своих стен, изменить поведение шариков (короче делайте че хотите).