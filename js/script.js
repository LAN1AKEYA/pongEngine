class Game {
    constructor(frameRate) {
        this.frameRate = frameRate;
        this.game = document.createElement("div");
        this.game.style.backgroundColor = "#000000";
        this.game.style.width = "100vw";
        this.game.style.height = "100vh";
        document.body.appendChild(this.game);
        class Wall {
            constructor(game, width, height, left, top) {
                this.wall = document.createElement('div');
                this.wall.style.width = `${width}`;
                this.wall.style.height = `${height}`;
                this.wall.style.left = `${left}`;
                this.wall.style.top = `${top}`;
                game.appendChild(this.wall);
                this.width = this.wall.offsetWidth;
                this.height = this.wall.offsetHeight;
                this.wall.style.position = 'absolute';
                this.positionX = this.wall.offsetLeft;
                this.positionY = this.wall.offsetTop;
                this.wall.style.backgroundColor = `grey`;
                this.wall.style.opacity = '0.8';
                //this.tray();
            }
            tray() {
                document.addEventListener('mousemove', (event) => {
                    this.positionX = event.clientX - (this.width / 2);
                    this.positionY = event.clientY - (this.height / 2);
                    this.wall.style.left = `${this.positionX}px`
                    this.wall.style.top = `${this.positionY}px`
                })
            }
        }
        class Ball {
            constructor(game) {
                this.ball = document.createElement("div");
                this.size = 50;
                this.ball.style.width = `${this.size}px`;
                this.ball.style.height = `${this.size}px`;
                this.ball.style.borderRadius = "100%";
                this.ball.style.position = "absolute";
                this.ball.style.opacity = '0.7';
                game.appendChild(this.ball);
                this.ball.style.backgroundColor = "#ffffff";
                this.counter = [5, 3];
                this.countRange = [[1, 7], [1, 7]];
                this.direction = [1, 1];
                this.positionX = this.positionY = 1;
            }
            checkDirection(frameWidth, frameHeight, walls) {

                const colision = this.recursiveCheckWalls(walls);

                if (colision) {
                    switch (colision.to) {
                        case "top":
                            this.direction[1] = -1;
                            this.positionY -= colision.force;
                            break;
                        case "bottom":
                            this.direction[1] = 1;
                            this.positionY += colision.force;
                            break;
                        case "left":
                            this.direction[0] = -1;
                            this.positionX -= colision.force;
                            break;
                        case "right":
                            this.direction[0] = 1;
                            this.positionX += colision.force;
                            break;
                    }
                }
            }
            move() {
                this.positionX += this.counter[0] * this.direction[0];
                this.positionY += this.counter[1] * this.direction[1];
                this.ball.style.left = `${this.positionX}px`;
                this.ball.style.top = `${this.positionY}px`;
            }
            getRandomRange(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            recursiveCheckWalls(walls) {
                if (walls.length == 0) {
                    return false;
                }
                else {
                    const ballPositionXR = this.positionX + this.size;
                    const ballPositionYB = this.positionY + this.size;
                    const wallPositionXR = walls[0].positionX + walls[0].width;
                    const wallPositionYB = walls[0].positionY + walls[0].height;

                    if (
                        ballPositionXR > walls[0].positionX &&
                        wallPositionXR > this.positionX &&
                        ballPositionYB > walls[0].positionY &&
                        wallPositionYB > this.positionY
                    ) {
                        const insideX = Math.min(
                            ballPositionXR - walls[0].positionX,
                            wallPositionXR - this.positionX
                        )
                        const insideY = Math.min(
                            ballPositionYB - walls[0].positionY,
                            wallPositionYB - (this.positionY)
                        )
                        if (insideX > insideY) {
                            this.counter[1] = this.getRandomRange(this.countRange[1][0], this.countRange[1][1]);
                            if (
                                (walls[0].positionY + walls[0].height / 2) >
                                (this.positionY + this.size / 2)
                            ) {
                                //top
                                return {
                                    "force": ballPositionYB - walls[0].positionY,
                                    "to": "top"
                                };
                            }
                            else {
                                //bottom
                                return {
                                    "force": wallPositionYB - this.positionY,
                                    "to": "bottom"
                                };
                            }
                        }
                        if (insideX < insideY) {
                            this.counter[0] = this.getRandomRange(this.countRange[0][0], this.countRange[0][1]);
                            if (
                                (walls[0].positionX + walls[0].width / 2) >
                                (this.positionX + this.size / 2)
                            ) {
                                //left
                                return {
                                    "force": ballPositionXR - walls[0].positionX,
                                    "to": "left"
                                }
                            }
                            else {
                                //right
                                return {
                                    "force": wallPositionXR - this.positionX,
                                    "to": "right"
                                };
                            }
                        }
                    }
                    return this.recursiveCheckWalls(walls.slice(1, walls.length));
                }
            }
        }

        this.balls = [];

        for (let i = 0; i < 30; i++) {
            this.balls.push(new Ball(this.game));
        }


        this.walls = [
            new Wall(this.game, `3px`, `100vh`, `-3px`, `0`),
            new Wall(this.game, `3px`, `100vh`, `100vw`, `0`),
            new Wall(this.game, `100vw`, `3px`, `0`, `-3px`),
            new Wall(this.game, `100vw`, `3px`, `0`, `100vh`),

            new Wall(this.game, `10px`, `66vh`, `33vw`, 0),
            new Wall(this.game, `10px`, `66vh`, `66vw`, `34vh`)
        ];

        this.startInvertal();

        window.addEventListener('focus', () => {
            this.startInvertal();
        })
        window.onblur = () => {
            this.stopInvertal()
        }


    }
    startInvertal() {
        this.interval = setInterval(() => {
            requestAnimationFrame(() => {
                if (this.balls[0] == undefined) {
                    this.balls.checkDirection(this.game.offsetWidth, this.game.offsetHeight, this.walls)
                    this.balls.move();
                }
                else {
                    for (let item of this.balls) {
                        item.checkDirection(this.game.offsetWidth, this.game.offsetHeight, this.walls)
                        item.move();
                    }
                }
            })
        }, this.frameRate);
    }
    stopInvertal() {
        clearInterval(this.interval)
    }
}

let game = new Game(5);

