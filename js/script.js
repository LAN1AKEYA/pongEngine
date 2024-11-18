class Game {
    constructor(config) {
        this.config = config;
        globalThis.game = document.createElement("div");
        globalThis.game.style.backgroundColor = "#000000";
        globalThis.game.style.width = "100vw";
        globalThis.game.style.height = "100vh";
        document.body.appendChild(globalThis.game);
        class Wall {
            constructor(wallConfig) {
                this.wall = document.createElement('div');
                this.wall.style.width = `${wallConfig.width}`;
                this.wall.style.height = `${wallConfig.height}`;
                this.wall.style.left = `${wallConfig.positionX}`;
                this.wall.style.top = `${wallConfig.positionY}`;
                globalThis.game.appendChild(this.wall);
                this.width = this.wall.offsetWidth;
                this.height = this.wall.offsetHeight;
                this.wall.style.position = 'absolute';
                this.positionX = this.wall.offsetLeft;
                this.positionY = this.wall.offsetTop;
                this.wall.style.backgroundColor = `grey`;
                this.wall.style.opacity = '0.8';

                if (wallConfig.movement == `tray`) {
                    this.tray();
                }
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
            constructor(ballConfig) {
                this.ballConfig = ballConfig;
                this.ball = document.createElement("div");
                this.size = ballConfig.constructor.size;
                this.ball.style.width = `${this.size}px`;
                this.ball.style.height = `${this.size}px`;
                this.ball.style.borderRadius = "100%";
                this.ball.style.position = "absolute";
                this.ball.style.opacity = '0.7';
                globalThis.game.appendChild(this.ball);
                this.ball.style.backgroundColor = "#ffffff";
                this.counter = ballConfig.acceleration.speed;
                this.countRange = ballConfig.acceleration.range;
                this.direction = [1, 1];
                this.positionX = ballConfig.constructor.spawnPosition.X;
                this.positionY = ballConfig.constructor.spawnPosition.Y;
                console.log(ballConfig.acceleration)
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

        if (this.config.devMode) {
            this.devMode();
        }

        this.balls = [];
        for (let item of config.balls) {
            this.balls.push(new Ball(item));
        }
       


        this.walls = [];
        for (let item of config.walls) {
            this.walls.push(new Wall(item));
        }

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
                for (let item of this.balls) {
                    item.checkDirection(globalThis.game.offsetWidth, globalThis.game.offsetHeight, this.walls)
                    item.move();
                }
            })
        }, this.config.frameRate);
    }
    stopInvertal() {
        clearInterval(this.interval);
    }
    devMode(comand) {
        class Panel {
            constructor() {
                this.panel = document.createElement('div');
                this.panel.style.width = '100px';
                this.panel.style.height = '50px';
                this.panel.style.position = 'absolute';
                this.panel.style.top = 0;
                this.panel.style.right = 0;
                this.panel.style.backgroundColor = 'grey';
                this.panel.innerHTML = 'none';
                document.body.appendChild(this.panel);
            }


        }
    }
}


let game = new Game({
    frameRate: 5,
    devMode: true,
    walls: [
        {
            width: `3px`,
            height: `100vh`,
            positionX: `-3px`,
            positionY: `0`,
            movement: 'static'
        },
        {
            width: `3px`,
            height: `100vh`,
            positionX: `100vw`,
            positionY: `0`,
            movement: 'static'
        },
        {
            width: `100vw`,
            height: `3px`,
            positionX: `0`,
            positionY: `-3px`,
            movement: 'static'
        },
        {
            width: `100vw`,
            height: `3px`,
            positionX: `0`,
            positionY: `100vh`,
            movement: 'static'
        },


        {
            width: `10px`,
            height: `66vh`,
            positionX: `33vw`,
            positionY: `0`,
            movement: 'static'
        },
        {
            width: `10px`,
            height: `66vh`,
            positionX: `66vw`,
            positionY: `34vh`,
            movement: 'static'
        },
        {
            width: `50px`,
            height: `50px`,
            positionX: `50vw`,
            positionY: `50vh`,
            movement: 'tray'
        },
    ],
    "balls": [
        {
            constructor: {
                size: 50,
                spawnPosition: {
                    "X": 50,
                    "Y": 50
                }
            },
            acceleration: {
                type: "linear",
                speed: [3, 3],
                range: [[3, 5], [2, 5]]
            },
        },
        
    ]
});
