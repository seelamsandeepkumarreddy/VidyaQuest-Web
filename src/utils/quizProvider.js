/**
 * QuizProvider utility ported from Android's QuizData.kt
 * Generates dynamic quiz questions for chapters that don't have predefined content in the database.
 */

class QuizProvider {
    /**
     * Simple seeded random number generator (LCG)
     */
    static getSeededRandom(seed) {
        let currentSeed = Number(seed) || 12345;
        return () => {
            currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
            const res = Math.abs(currentSeed) / 4294967296;
            return isNaN(res) ? Math.random() : res;
        };
    }

    /**
     * Java-like hashCode for strings
     */
    static hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Fisher-Yates shuffle with seeded random
     */
    static shuffle(array, random) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    static getQuestions(grade, subject, chapter, formulas = []) {
        if (subject === "Mathematics") {
            return this.generateMathematicsProblems(grade, chapter);
        } else {
            return this.generateDynamicHardQuestions(grade, subject, chapter, formulas);
        }
    }

    static generateMathematicsProblems(grade, chapter) {
        const chapterName = chapter.trim().toLowerCase();
        const g = parseInt(grade) || 8;
        const seed = Math.abs(this.hashCode(String(grade)) + this.hashCode(String(chapter)));
        const random = this.getSeededRandom(seed);

        let problems = [];

        if (chapterName.includes("rational") || chapterName.includes("real number") || chapterName.includes("number system")) {
            if (g <= 8) {
                const a = Math.floor(random() * 9) + 1;
                const b = Math.floor(random() * 10) + 11;
                problems = [
                    ["If a rational number is multiplied by its reciprocal, the result is always:", ["1", "0", "-1", "The number itself"]],
                    ["Find the sum of the additive inverse of " + a + "/3 and the multiplicative inverse of 1/" + b + ":", [(b - a) / 3 + "", (a + b) / 3 + "", b + "/" + a, "0"]],
                    ["Which property ensures that " + a + "/5 + (2/3 + 1/4) = (" + a + "/5 + 2/3) + 1/4?", ["Associative", "Commutative", "Distributive", "Closure"]],
                    ["Solve for x: (" + a + "/5) * x = -2/" + b, ["-" + 10 + "/" + (a * b), 10 + "/" + (a * b), "-" + b + "/" + a, "1"]],
                    ["A rational number " + a + "/b is called a terminating decimal if b has prime factors of only:", ["2 and 5", "3 and 7", "2 and 3", "Any prime"]],
                    ["Which of the following is NOT a rational number between 1/" + a + " and 1/" + (a + 1) + "?", ["1/" + (a * 2), "2/" + (2 * a + 1), "3/" + (3 * a + 1), "None"]],
                    ["If x = " + a + "/10 and y = 1/" + b + ", evaluate (x + y) / (x - y).", [(a * b + 10) + "/" + (a * b - 10), "1", "-1", "0"]],
                    ["The product of a non-zero rational number and its reciprocal is always:", ["Positive Identity", "Zero", "Negative Identity", "The number"]],
                    ["The sum of two rational numbers is " + a + ". If one is -" + b + "/3, find the other.", [(3 * a + b) / 3 + "", (3 * a - b) / 3 + "", b + "/3", "0"]],
                    ["Represent " + a + "/9 as a repeating decimal.", ["0." + a + a + a + "...", "0." + a + "9", "0.0" + a, "0.9" + a]]
                ];
            } else {
                const p = Math.floor(random() * 19) + 2;
                problems = [
                    ["Which of the following is an irrational number?", ["sqrt(" + p + ")", "sqrt(" + (p * p) + ")", "2/3", "0.5"]],
                    ["The decimal expansion of an irrational number is:", ["Non-terminating non-repeating", "Terminating", "Repeating", "None"]],
                    ["If p and q are co-prime, then HCF(p,q) is:", ["1", "p*q", "0", "None"]],
                    ["Find HCF of " + (p * 4) + " and " + (p * 9) + ".", [p + "", "2", "6", "12"]],
                    ["Explain Euclid's division lemma: a = bq + r. What is the condition for r?", ["0 <= r < b", "r < b", "0 < r < b", "r = b"]],
                    ["Simplify: (sqrt(" + p + ") + sqrt(1))(sqrt(" + p + ") - sqrt(1))", [(p - 1) + "", p + "", "sqrt(" + p + ")", "0"]],
                    ["Represent 0." + p + p + p + "... in p/q form.", [p + "/99", "3/10", "33/100", "3/1"]],
                    ["Every composite number can be expressed as a product of:", ["Primes", "Odd numbers", "Even numbers", "Whole numbers"]],
                    ["What is the LCM of " + p + ", " + (p * 2) + " and " + (p * 3) + "?", [(p * 6) + "", (p * 2) + "", "105", "840"]],
                    ["State the fundamental theorem of Arithmetic.", ["Unique prime factorization", "Euclidean division", "Pythagoras theorem", "None"]]
                ];
            }
        } else if (chapterName.includes("equation") || chapterName.includes("variable")) {
            const a = Math.floor(random() * 5) + 2;
            const b = Math.floor(random() * 11) + 5;
            const c = Math.floor(random() * 21) + 20;
            if (g <= 8) {
                problems = [
                    ["Solve for x: " + a + "x + " + b + " = " + c, [(c - b) / a + "", "10", "15", "20"]],
                    ["Solve: x - " + a + " = " + b, [(a + b) + "", "4", "-4", "21"]],
                    ["If " + a + "y = " + (a * b) + ", then y is:", [b + "", "9", "15", "36"]],
                    [a + " times a number is " + (a * b) + ". What is the number?", [b + "", "5", "25", "45"]],
                    ["Solve: " + a + "x/3 = " + b, [(b * 3) / a + "", "30", "20", "5"]],
                    ["Find x if x + " + a + ".5 = " + b + ".", [(b - a) + ".5", "7.5", "2", "3"]],
                    ["The sum of x and " + b + " is " + c + ". Equation is:", ["x + " + b + " = " + c, b + "x = " + c, "x/" + b + " = " + c, "x - " + b + " = " + c]],
                    ["Solve: " + a + "(x + 1) = " + (a * b), [(b - 1) + "", "4", "5", "6"]],
                    ["If " + a + "x - " + b + " = 1, find x.", [((1 + b) / a) + "", "1.5", "3", "0"]],
                    ["Solve: x/" + a + " + x/" + b + " = 10", [((10 * a * b) / (a + b)) + "", "10", "6", "5"]]
                ];
            } else {
                const k = Math.floor(random() * 5) + 2;
                problems = [
                    ["For what value of k will the system of equations " + a + "x + y = 10, (" + (a * 2) + ")x + ky = 20 have infinite solutions?", ["2", "1", a + "", "0"]],
                    ["The graph of " + a + "*x + " + b + "*y = " + c + " intersects the x-axis at:", ["(" + (c / a).toFixed(2) + ", 0)", "(0, " + (c / b).toFixed(2) + ")", "(1, 1)", "None"]],
                    ["If the point (" + k + ", " + k + ") lies on the line " + a + "*x + " + b + "*y = " + c + ", then solve for k:", [(c / (a + b)).toFixed(2) + "", "5", "0", "1"]],
                    ["Solve for x and y: x + y = " + b + ", x - y = " + a + ". Then find the value of x/y.", [((b + a) / (b - a)).toFixed(2) + "", "1", b + "", a + ""]],
                    ["Find the discriminant of " + k + "*x^2 - (" + a + " + " + b + ")x + 1 = 0.", [((a + b) * (a + b) - 4 * k) + "", "0", "16", "-1"]],
                    ["Roots of " + a + "*x^2 - (" + (a + b) + ")x + " + b + " = 0 are:", ["1, " + b + "/" + a, "-1, -" + b + "/" + a, "0, " + b, "None"]],
                    ["If one root of x^2 + kx + 12 = 0 is 3, what is the other root?", ["4", "-4", "1", "12"]],
                    ["The product of the roots of a standard quadratic equation ax^2 + bx + c = 0 is:", ["c/a", "-b/a", "b/a", "sqrt(c/a)"]],
                    ["A quadratic equation has no real roots if its discriminant (D) is:", ["D < 0", "D = 0", "D > 0", "D = 1"]],
                    ["Solve by elimination: 2x+y=" + c + ", x+y=" + b + ". Find x.", [(c - b) + "", (b - c) + "", "10", "0"]]
                ];
            }
        } else if (chapterName.includes("geometry") || chapterName.includes("triangle") || chapterName.includes("circle") || chapterName.includes("quadrilateral")) {
            const s = Math.floor(random() * 8) + 3;
            if (g <= 8) {
                problems = [
                    ["Sum of interior angles of a quadrilateral is:", ["360 deg", "180 deg", "540 deg", "90 deg"]],
                    ["A parallelogram with all sides equal is a:", ["Rhombus", "Rectangle", "Trapezium", "Kite"]],
                    ["Each angle of a rectangle is:", ["90 deg", "60 deg", "45 deg", "120 deg"]],
                    ["A polygon with " + s + " sides is called a:", [s === 5 ? "Pentagon" : s === 6 ? "Hexagon" : "Polygon(" + s + ")", "Hexagon", "Octagon", "Heptagon"]],
                    ["The diagonals of a square are:", ["Equal and bisect at 90 deg", "Unequal", "Parallel", "Only bisect"]],
                    ["If three angles of a quadrilateral are 100, 80, 70, find the fourth.", ["110 deg", "90 deg", "100 deg", "80 deg"]],
                    ["Minimum number of measurements required to construct a unique triangle:", ["3", "2", "4", "1"]],
                    ["A regular polygon has all sides and angles:", ["Equal", "Different", "Zero", "None"]],
                    ["What is the sum of exterior angles of any polygon?", ["360 deg", "180 deg", "720 deg", "540 deg"]],
                    ["Number of diagonals in a hexagon:", ["9", "6", "5", "12"]]
                ];
            } else {
                problems = [
                    ["In triangle ABC, if AB=AC and angle A=40, what is angle B?", ["70 deg", "40 deg", "100 deg", "140 deg"]],
                    ["The angle subtended by a diameter at any point on the circle is:", ["90 deg", "180 deg", "Depends on radius", "360 deg"]],
                    ["A cyclic quadrilateral has opposite angles that sum up to:", ["180 deg", "360 deg", "90 deg", "270 deg"]],
                    ["If the length of a tangent from a point P to a circle is 24cm and distance from center is 25cm, radius is:", ["7 cm", "10 cm", "1 cm", "49 cm"]],
                    ["The area of a circle inscribed in a square of side 14cm is:", ["154 sq cm", "196 sq cm", "44 sq cm", "None"]],
                    ["The ratio of the volume of a sphere to a cylinder with the same radius and height (=2r) is:", ["2 : 3", "3 : 4", "1 : 1", "1 : 2"]],
                    ["Find the distance between P(1, 2) and Q(" + s + ", " + (s + 1) + ").", ["sqrt(" + ((s - 1) * (s - 1) + (s - 1) * (s - 1)) + ")", (s + 1) + "", (s - 1) + "", "None"]],
                    ["The midpoint of a line segment joining (" + s + ", 0) and (0, " + s + ") is:", ["(" + (s / 2) + ", " + (s / 2) + ")", "(" + s + ", " + s + ")", "(0, 0)", "None"]],
                    ["How many circles can pass through three non-collinear points?", ["Exactly one", "Infinite", "Two", "None"]],
                    ["Angle made by minute hand in 5 minutes is:", ["30 deg", "6 deg", "600 deg", "5 deg"]]
                ];
            }
        } else if (chapterName.includes("mensuration") || chapterName.includes("area") || chapterName.includes("volume") || chapterName.includes("surface")) {
            const r = Math.floor(random() * 15) + 7;
            if (g <= 8) {
                problems = [
                    ["Area of a rectangle with length '" + r + "' and width '5' is:", [(r * 5) + "", (2 * (r + 5)) + "", (r + 5) + "", (r / 5) + ""]],
                    ["Perimeter of a square with side '" + r + "' is:", [(4 * r) + "", (r * r) + "", (2 * r) + "", (r / 4) + ""]],
                    ["Area of a circle with radius '" + r + "' is:", ["pi * " + (r * r), "2 * pi * " + r, "pi * d", (r * r) + ""]],
                    ["Volume of a cube with side '" + r + "' is:", [(r * r * r) + "", (6 * r * r) + "", (4 * r) + "", (r * r) + ""]],
                    ["Area of a trapezium = 1/2 * (sum of parallel sides) * ...?", ["Height", "Base", "Diagonal", "Side"]],
                    ["Surface area of a cuboid = 2(lb + bh + ...?)", ["hl", "lh", "hb", "bl"]],
                    ["Volume of a cylinder is:", ["pi * r^2 * h", "2 * pi * r * h", "1/3 * pi * r^2 * h", "pi * r * h"]],
                    ["Base area of a cone is:", ["pi * r^2", "pi * r * l", "2 * pi * r", "1/2 * r"]],
                    ["Calculate area of square with side " + r + "cm.", [(r * r) + " sq cm", (4 * r) + " sq cm", (2 * r) + " sq cm", "120 sq cm"]],
                    ["If radius is 7cm, find circumference (pi=22/7).", ["44 cm", "154 cm", "14 cm", "77 cm"]]
                ];
            } else {
                problems = [
                    ["Total Surface Area of a right circular cone is:", ["pi*r(l+r)", "pi*r*l", "2*pi*r*h", "4*pi*r^2"]],
                    ["Volume of a sphere with radius '" + r + "' is:", ["4/3 * pi * " + (r * r * r), "4 * pi * " + (r * r), "2/3 * pi * " + (r * r * r), "pi * " + (r * r * r)]],
                    ["Volume of a frustum of a cone depends on:", ["Two radii and height", "Only one radius", "Slant height only", "None"]],
                    ["Area of triangle with sides a, b, c using Heron's formula involves 's' where s is:", ["Semi-perimeter", "Sum", "Square", "Side"]],
                    ["Surface Area of a hemisphere is:", ["3 * pi * r^2", "2 * pi * r^2", "4 * pi * r^2", "pi * r^2"]],
                    ["Ratio of volumes of cone and cylinder with same base and height:", ["1 : 3", "3 : 1", "1 : 1", "1 : 2"]],
                    ["Number of faces in a tetrahedron:", ["4", "6", "8", "12"]],
                    ["Find volume of cube if its total surface area is " + (6 * r * r) + " sq cm.", [(r * r * r) + " cubic cm", "25 cubic cm", "100 cubic cm", "216 cubic cm"]],
                    ["Find the ratio of area of circle to its circumference if r = " + r + ".", [r + " : 2", "1 : 1", "2 : 1", "pi : 2"]],
                    ["Diagonal of a cuboid is given by sqrt(l^2 + b^2 + ...?)", ["h^2", "2h", "h", "hb"]]
                ];
            }
        } else if (chapterName.includes("data") || chapterName.includes("statistics") || chapterName.includes("probability") || chapterName.includes("graph")) {
            const n = Math.floor(random() * 10) + 2;
            if (g <= 8) {
                problems = [
                    ["The number of times a particular observation occurs is its:", ["Frequency", "Range", "Class mark", "Mean"]],
                    ["A graph that uses bars to represent frequency is a:", ["Histogram/Bar Graph", "Pie Chart", "Line Graph", "Pictograph"]],
                    ["In a pie chart, the total angle at the center is:", ["360 deg", "180 deg", "90 deg", "100 deg"]],
                    ["Finding the average value is called finding the:", ["Mean", "Median", "Mode", "Range"]],
                    ["The middle-most value of a sorted data set is the:", ["Median", "Mean", "Mode", "Frequency"]],
                    ["Probability of a sure event is:", ["1", "0", "0.5", "Infinite"]],
                    ["A coin is tossed. Probability of getting Heads is:", ["1/2", "1", "0", "1/4"]],
                    ["Range of data = Highest value - ...?", ["Lowest value", "Average", "Mean", "Mode"]],
                    ["Data point that occurs most frequently is the:", ["Mode", "Median", "Mean", "Frequency"]],
                    ["Probability of an impossible event is:", ["0", "1", "-1", "0.5"]]
                ];
            } else {
                problems = [
                    ["Class mark of a class interval is:", ["(Upper + Lower limit)/2", "Upper - Lower limit", "Upper limit", "Lower limit"]],
                    ["Relationship between Mean, Median and Mode (Empirical formula):", ["3 Median = Mode + 2 Mean", "Median = Mean + Mode", "Mode = 3 Median + 2 Mean", "None"]],
                    ["Cumulative frequency is used to determine the:", ["Median", "Mean", "Mode", "Range"]],
                    ["Total probability of all elementary events of an experiment is:", ["1", "0", "Standard", "None"]],
                    ["P(E) + P(not E) = ...?", ["1", "0", "-1", "0.5"]],
                    ["Probability of getting a prime number when a die is thrown:", ["1/2", "1/3", "1/6", "2/3"]],
                    [`The median of first ${n} prime numbers depends on n=${n}`, ["Calculation required", "3", "7", "2"]],
                    ["A card is drawn from a deck of 52. Probability of getting an Ace is:", ["1/13", "1/52", "4/13", "1/4"]],
                    [`Mean of first '${n}' natural numbers is:`, [`${(n + 1) / 2}`, "n/2", "n+1", "n(n+1)/2"]],
                    [`Mode of data ${n}, ${n}, ${n + 1}, ${n + 2} is:`, [`${n}`, `${n + 1}`, `${n + 2}`, "None"]]
                ];
            }
        } else if (chapterName.includes("square") || chapterName.includes("cube")) {
            const n = Math.floor(random() * 14) + 2;
            if (g <= 8) {
                problems = [
                    ["The square of " + n + " is:", [(n * n) + "", (n + n) + "", (n * 2) + "", (n * n + 1) + ""]],
                    ["Which of these is a perfect square?", [((n + 1) * (n + 1)) + "", (n * 3 + 1) + "", (n * 7) + "", (n * 11 + 2) + ""]],
                    ["The square root of " + (n * n) + " is:", [n + "", (n + 1) + "", (n - 1) + "", (n * 2) + ""]],
                    ["A number ending in 2, 3, 7, or 8 is:", ["Never a perfect square", "Always a perfect square", "Sometimes a perfect square", "Always odd"]],
                    ["How many non-square numbers lie between " + (n * n) + " and " + ((n + 1) * (n + 1)) + "?", [(2 * n) + "", (2 * n + 1) + "", n + "", (n + 1) + ""]],
                    ["The cube of " + n + " is:", [(n * n * n) + "", (n * n) + "", (3 * n) + "", (n * n + n) + ""]],
                    ["The cube root of " + (n * n * n) + " is:", [n + "", (n * n) + "", (n + 1) + "", (n * 3) + ""]],
                    ["If a perfect square ends in 6, its square root ends in:", ["4 or 6", "2 or 8", "1 or 9", "5"]],
                    ["The smallest number by which " + (n * n * 2) + " must be multiplied to get a perfect square is:", ["2", "3", "4", n + ""]],
                    ["A number is a perfect cube if its prime factors each appear in groups of:", ["3", "2", "4", "1"]]
                ];
            } else {
                problems = [
                    ["The square root of " + (n * n) + " is:", [n + "", (n + 1) + "", (n * 2) + "", "None"]],
                    ["Which of the following is a perfect cube?", [(n * n * n) + "", (n * n + 1) + "", (n * 3) + "", (n * n) + ""]],
                    ["Cube root of 27000 is:", ["30", "300", "27", "3"]],
                    ["sqrt(" + (n * n) + " + " + ((n + 1) * (n + 1)) + ") is simplified to:", ["sqrt(" + (n * n + (n + 1) * (n + 1)) + ")", n + "", (n + 1) + "", "None"]],
                    ["If x^2 = " + (n * n) + ", then x is:", ["+/-" + n, n + "", "-" + n, "0"]],
                    ["Square root of 0.0081 is:", ["0.09", "0.9", "0.009", "0.81"]],
                    ["Cube root of -" + (n * n * n) + " is:", ["-" + n, n + "", "Error", "0"]],
                    ["Number of digits in the square root of a 6-digit perfect square is:", ["3", "6", "2", "4"]],
                    ["If cbrt(x) = " + n + ", then x is:", [(n * n * n) + "", (n * n) + "", (3 * n) + "", n + ""]],
                    ["The unit digit of " + (n * n) + " is:", [((n * n) % 10) + "", (n % 10) + "", "0", "5"]]
                ];
            }
        } else if (chapterName.includes("comparing") || chapterName.includes("percent") || chapterName.includes("ratio")) {
            const p = Math.floor(random() * 26) + 5;
            const cost = (Math.floor(random() * 401) + 100) * 10;
            problems = [
                ["Find " + p + "% of " + cost + ":", [((p * cost) / 100) + "", (p + cost) + "", (cost / p) + "", "0"]],
                ["If CP = " + cost + " and SP = " + (cost + (cost * p) / 100) + ", profit % is:", [p + "%", (p + 5) + "%", (p - 5) + "%", "0%"]],
                ["Simple Interest on Rs." + cost + " at " + p + "% for 2 years is:", ["Rs." + ((cost * p * 2) / 100), "Rs." + ((cost * p) / 100), "Rs." + (cost / p), "Rs.0"]],
                ["Compound Interest formula is:", ["A = P(1 + R/100)^n", "A = P + PRT", "A = PRT/100", "A = P * R * T"]],
                ["Increase of " + p + "% followed by a decrease of " + p + "% gives a net:", ["Decrease", "Increase", "No change", "Double"]],
                ["Discount % when MP = " + cost + " and SP = " + (cost - (cost * p) / 100) + " is:", [p + "%", (p + 10) + "%", (p - 10) + "%", "50%"]],
                ["If population grows at " + p + "% per year and current population is " + cost + ", after 1 year it is:", [(cost + (cost * p) / 100) + "", cost + "", (cost * p) + "", "0"]],
                ["GST is an example of:", ["Tax on goods and services", "Discount", "Simple Interest", "None"]],
                ["A shopkeeper buys at Rs." + cost + " and sells at 10% loss. SP is:", ["Rs." + ((cost * 90) / 100), "Rs." + (cost + 100), "Rs." + cost, "Rs.0"]],
                ["Successive discounts of 10% and 20% on Rs." + cost + " equal a single discount of:", ["28%", "30%", "25%", "32%"]]
            ];
        } else if (chapterName.includes("algebraic") || chapterName.includes("expression") || chapterName.includes("identit") || chapterName.includes("polynomial")) {
            const a = Math.floor(random() * 7) + 2;
            const b = Math.floor(random() * 6) + 1;
            if (g <= 8) {
                problems = [
                    ["The product of " + a + "x and (x + " + b + ") is:", [a + "x^2 + " + (a * b) + "x", a + "x + " + b, (a * b) + "x", "x^2"]],
                    ["(a + b)^2 is equal to:", ["a^2 + 2ab + b^2", "a^2 + b^2", "a^2 - 2ab + b^2", "2a + 2b"]],
                    ["(a - b)^2 is equal to:", ["a^2 - 2ab + b^2", "a^2 + 2ab + b^2", "a^2 - b^2", "a^2 + b^2"]],
                    ["(a + b)(a - b) is equal to:", ["a^2 - b^2", "a^2 + b^2", "(a - b)^2", "(a + b)^2"]],
                    ["Evaluate (" + a + " + " + b + ")^2 using identity:", [((a + b) * (a + b)) + "", (a * a + b * b) + "", (2 * a * b) + "", (a + b) + ""]],
                    ["The coefficient of x^2 in " + a + "x^2 + " + b + "x + 1 is:", [a + "", b + "", "1", "x^2"]],
                    ["A monomial has how many terms?", ["1", "2", "3", "0"]],
                    ["Like terms have the same:", ["Variables with same powers", "Coefficients", "Constants", "Signs"]],
                    ["Evaluate (" + a + ")^2 - (" + b + ")^2 using identity:", [(a * a - b * b) + "", (a * a + b * b) + "", ((a - b) * (a - b)) + "", "0"]],
                    ["Degree of the polynomial " + a + "x^3 + " + b + "x + 7 is:", ["3", "2", "1", "7"]]
                ];
            } else {
                problems = [
                    ["The zeroes of p(x) = x^2 - " + (a + b) + "x + " + (a * b) + " are:", [a + ", " + b, "-" + a + ", -" + b, a + ", -" + b, "0, " + (a + b)]],
                    ["If p(x) = " + a + "x - " + b + ", then the zero of p(x) is:", [b + "/" + a, a + "/" + b, "-" + b + "/" + a, "0"]],
                    ["Degree of a cubic polynomial is:", ["3", "4", "2", "1"]],
                    ["Remainder when x^2 + 1 is divided by x - 1 is:", ["2", "0", "1", "-1"]],
                    ["Factor theorem: (x - a) is a factor of p(x) if:", ["p(a) = 0", "p(a) = 1", "p(0) = a", "None"]],
                    ["Sum of zeroes of ax^2 + bx + c is:", ["-b/a", "c/a", "b/a", "-c/a"]],
                    ["Product of zeroes of ax^2 + bx + c is:", ["c/a", "-b/a", "b/a", "-c/a"]],
                    ["Number of zeroes of a quadratic polynomial is at most:", ["2", "3", "1", "0"]],
                    ["Expand: (x + " + a + ")(x + " + b + ") =", ["x^2 + " + (a + b) + "x + " + (a * b), "x^2 + " + (a * b) + "x + " + (a + b), (a * b) + "x^2", "x^2 - " + (a + b) + "x"]],
                    ["A polynomial of degree 0 is called:", ["Constant polynomial", "Linear", "Quadratic", "Cubic"]]
                ];
            }
        } else if (chapterName.includes("exponent") || chapterName.includes("power")) {
            const a = Math.floor(random() * 5) + 2;
            const m = Math.floor(random() * 4) + 2;
            const n = Math.floor(random() * 4) + 1;
            problems = [
                ["Simplify: " + a + "^" + m + " * " + a + "^" + n + " =", [a + "^" + (m + n), a + "^" + (m * n), (a * a) + "^" + m, a + "^" + (m - n)]],
                ["Value of " + a + "^0 is:", ["1", "0", a + "", "Undefined"]],
                ["Simplify: " + a + "^" + m + " / " + a + "^" + n + " =", [a + "^" + (m - n), a + "^" + (m + n), a + "^" + (m * n), "1"]],
                [+ a + "^-2 is equal to:", ["1/" + (a * a), (a * a) + "", "-" + (a * a), "0"]],
                ["Standard form of " + (a * 10000) + " is:", [a + ".0 * 10^4", a + "0 * 10^3", (a * 10) + " * 10^2", "None"]],
                ["(" + a + "^2)^3 is equal to:", [a + "^6", a + "^5", a + "^8", a + "^9"]],
                ["Which is larger: 2^3 or 3^2?", ["3^2 = 9", "2^3 = 8", "Both equal", "Cannot compare"]],
                ["Express 0.00" + a + " in standard form:", [a + " * 10^-3", a + " * 10^3", a + " * 10^-2", a + " * 10^2"]],
                ["The value of (-1)^" + (2 * m) + " is:", ["1", "-1", "0", "Undefined"]],
                ["If 2^n = " + Math.pow(2, n) + ", then n is:", [n + "", (n + 1) + "", (n - 1) + "", "0"]]
            ];
        } else if (chapterName.includes("proportion")) {
            const x1 = Math.floor(random() * 9) + 2;
            const y1 = Math.floor(random() * 10) + 3;
            problems = [
                ["If x/y = constant, x and y are:", ["Directly proportional", "Inversely proportional", "Unrelated", "Equal"]],
                ["If x * y = constant, x and y are:", ["Inversely proportional", "Directly proportional", "Equal", "Unrelated"]],
                ["If " + x1 + " workers take " + y1 + " days, " + (x1 * 2) + " workers will take:", [(y1 / 2) + " days", y1 + " days", (y1 * 2) + " days", "1 day"]],
                ["Cost of " + x1 + " pens is Rs." + (x1 * y1) + ". Cost of 1 pen is:", ["Rs." + y1, "Rs." + x1, "Rs." + (x1 + y1), "Rs." + (x1 * y1)]],
                ["If a car travels " + (x1 * 60) + " km in " + x1 + " hours, speed is:", ["60 km/h", (x1 * 60) + " km/h", x1 + " km/h", "None"]],
                ["Speed and time (for same distance) are:", ["Inversely proportional", "Directly proportional", "Equal", "Unrelated"]],
                ["More pipes filling a tank -> time taken is:", ["Less", "More", "Same", "Doubled"]],
                ["In direct proportion, the ratio x1/y1 = x2/y2. If x1=" + x1 + ", y1=" + y1 + ", x2=" + (x1 * 2) + ", then y2=:", [(y1 * 2) + "", y1 + "", (y1 / 2) + "", "0"]],
                ["Unitary method means finding the value of:", ["One unit first", "All units at once", "The largest unit", "The ratio"]],
                ["Scale of map 1:" + (x1 * 1000) + " means 1 cm on map = :", [(x1 * 1000) + " cm actual", x1 + " cm actual", "1 cm actual", (x1 * 100) + " cm actual"]]
            ];
        } else if (chapterName.includes("factor")) {
            const a = Math.floor(random() * 7) + 2;
            const b = Math.floor(random() * 6) + 1;
            problems = [
                ["Factorise: " + a + "x + " + (a * b) + " =", [a + "(x + " + b + ")", "x(" + a + " + " + b + ")", (a * b) + "x", a + " + " + b]],
                ["Factorise: x^2 + " + (a + b) + "x + " + (a * b) + " =", ["(x+" + a + ")(x+" + b + ")", "(x-" + a + ")(x-" + b + ")", "(x+" + (a * b) + ")(x+1)", "None"]],
                ["Factorise using identity: x^2 - " + (a * a) + " =", ["(x+" + a + ")(x-" + a + ")", "(x-" + a + ")^2", "(x+" + a + ")^2", "x(x-" + a + ")"]],
                ["Common factor of " + (a * b) + "x^2 and " + a + "x is:", [a + "x", a + "", "x^2", (a * b) + ""]],
                ["Factorise: x^2 - " + (2 * a) + "x + " + (a * a) + " =", ["(x-" + a + ")^2", "(x+" + a + ")^2", "(x-" + a + ")(x+" + a + ")", "None"]],
                ["Division: " + (a * b) + "x^2 divided by " + a + "x =", [b + "x", a + "x", (a * b) + "", "x^2"]],
                ["Verify factorisation by:", ["Multiplying the factors", "Adding the factors", "Subtracting", "Dividing"]],
                ["Factorise by regrouping: ax + bx + ay + by =", ["(a+b)(x+y)", "(a-b)(x-y)", "abxy", "None"]],
                ["Factorise: " + (a * a) + "x^2 + " + (2 * a * b) + "x + " + (b * b) + " =", ["(" + a + "x+" + b + ")^2", "(" + a + "x-" + b + ")^2", (a * b) + "x^2", "None"]],
                ["HCF of " + (a * b) + " and " + (a * a) + " is:", [a + "", (a * b) + "", (a * a) + "", "1"]]
            ];
        } else if (chapterName.includes("trigonometr")) {
            problems = [
                ["sin 30 deg is equal to:", ["1/2", "sqrt(3)/2", "1", "0"]],
                ["cos 60 deg is equal to:", ["1/2", "sqrt(3)/2", "0", "1"]],
                ["tan 45 deg is equal to:", ["1", "0", "sqrt(3)", "1/sqrt(3)"]],
                ["sin^2(theta) + cos^2(theta) is always equal to:", ["1", "0", "sin theta", "cos theta"]],
                ["If sin A = 3/5, then cos A is:", ["4/5", "3/4", "5/3", "5/4"]],
                ["tan theta can be written as:", ["sin theta / cos theta", "cos theta / sin theta", "1 / sin theta", "1 / cos theta"]],
                ["The value of sin 0 deg is:", ["0", "1", "1/2", "inf"]],
                ["The value of cos 90 deg is:", ["0", "1", "-1", "1/2"]],
                ["sec theta is the reciprocal of:", ["cos theta", "sin theta", "tan theta", "cot theta"]],
                ["sin(90 - theta) is equal to:", ["cos theta", "sin theta", "tan theta", "-cos theta"]]
            ];
        } else if (chapterName.includes("arithmetic") || chapterName.includes("progression")) {
            const a1 = Math.floor(random() * 9) + 2;
            const d = Math.floor(random() * 5) + 2;
            problems = [
                ["The nth term of an AP is given by:", ["a + (n-1)d", "a + nd", "a * d", "n * d"]],
                ["Find the 10th term of AP: " + a1 + ", " + (a1 + d) + ", " + (a1 + 2 * d) + ", ...", [(a1 + 9 * d) + "", (10 * d) + "", (a1 + 10 * d) + "", (a1 * 10) + ""]],
                ["Sum of first n terms of an AP = :", ["n/2 [2a + (n-1)d]", "n * a * d", "n(n+1)/2", "a + (n-1)d"]],
                ["Common difference of the AP: " + a1 + ", " + (a1 + d) + ", " + (a1 + 2 * d) + " is:", [d + "", a1 + "", (a1 + d) + "", (2 * d) + ""]],
                ["If a = " + a1 + ", d = " + d + ", find S_5 (sum of first 5 terms):", [((5 * (2 * a1 + 4 * d)) / 2) + "", (5 * a1) + "", (5 * d) + "", "0"]],
                ["Which of the following is an AP?", [a1 + ", " + (a1 + d) + ", " + (a1 + 2 * d) + ", " + (a1 + 3 * d), "1, 3, 6, 10", "1, 4, 9, 16", "2, 4, 8, 16"]],
                ["The common difference can be:", ["Positive, negative, or zero", "Only positive", "Only negative", "Only zero"]],
                ["If the last term is l, S_n = :", ["n/2 (a + l)", "n(a + l)", "n * l", "a * l"]],
                ["Sum of first 10 natural numbers is:", ["55", "50", "100", "10"]],
                ["In an AP, if a_3 = " + (a1 + 2 * d) + " and a_7 = " + (a1 + 6 * d) + ", then d = :", [d + "", (2 * d) + "", a1 + "", "0"]]
            ];
        } else {
            const v1 = Math.floor(random() * 11) + 5;
            const v2 = Math.floor(random() * 31) + 20;
            problems = [
                ["Evaluate the " + chapterName + " module for Grade " + grade + " level application.", ["Execute standard validation", "Ignore edge cases", "Reset constants", "Abort"]],
                ["Calculate: " + v1 + "% of " + (v2 * 10), [((v1 * v2 * 10) / 100) + "", "50", "100", "120"]],
                ["Solve for x: x + " + v1 + " = " + v2, [(v2 - v1) + "", "10", "35", "5"]],
                ["The area of a square with side " + v1 + " cm is:", [(v1 * v1) + " sq cm", (4 * v1) + " sq cm", (2 * v1) + " sq cm", "None"]],
                ["If x = " + v1 + ", what is 2x + " + v2 + "?", [(2 * v1 + v2) + "", "15", "10", "20"]],
                ["Calculate: " + (v2 * 2) + " / " + v1, [((v2 * 2) / v1).toFixed(2), "5", "1", "10"]],
                ["Simplify: (10 * " + v1 + ") - (2 * " + v2 + ")", [(10 * v1 - 2 * v2) + "", "12", "5", "10"]],
                ["What is the square root of " + (v1 * v1) + "?", [v1 + "", "2", "1", "0"]],
                ["Find the perimeter of equilateral triangle with side " + v1 + " cm.", [(3 * v1) + " cm", (v1 * v1) + " cm", (2 * v1) + " cm", v1 + " cm"]],
                ["If y = " + (v1 + v2) + ", then 2y is:", [(2 * (v1 + v2)) + "", "10", "5", "5"]]
            ];
        }

        return problems.map(([text, options]) => {
            const correctOption = options[0];
            const shuffledOptions = this.shuffle(options, random);
            const correctIndex = shuffledOptions.indexOf(correctOption);
            return {
                id: Math.random().toString(36).substr(2, 9),
                id: Math.random().toString(36).substr(2, 9),
                text: text,
                options: shuffledOptions,
                correct: correctIndex,
                review_text: "Review chapter concepts to understand why " + correctOption + " is the correct answer."
            };
        });
    }

    static generateDynamicHardQuestions(grade, subject, chapter, formulas) {
        const chapterName = chapter.trim();
        const seed = Math.abs(this.hashCode(String(grade)) + this.hashCode(String(chapter)));
        const random = this.getSeededRandom(seed);

        const allFormulaExplanations = formulas.filter(f => f.includes(":")).map(f => f.split(":")[1].trim());

        const formulaQuestions = formulas.filter(f => f.includes(":")).map(f => {
            const [concept, explanation] = f.split(":").map(s => s.trim());
            let text = "Regarding '" + concept + "', which statement is correct?";
            if (subject === "Hindi") text = "'" + concept + "' के संबंध में कौन सा कथन सही है?";
            if (subject === "Telugu") text = "'" + concept + "' కి సంబంధించి ఏది సరైనది?";

            const otherExplanations = this.shuffle(allFormulaExplanations.filter(e => e !== explanation).slice(0, 2), random);
            let decoys = otherExplanations.length >= 2 ? [...otherExplanations, "None of the above"] : ["It is not related to " + chapterName + ".", "It is an invalid concept.", "None of the above"];
            
            const options = Array.from(new Set([explanation, ...decoys])).slice(0, 4);
            return { text, options, correct: explanation };
        });

        let templates = [];
        if (subject === "Hindi") {
            templates = [
                ["'" + chapterName + "' पाठ के संदर्भ में लेखक का मुख्य उद्देश्य क्या है?", ["सामाजिक विसंगतियों पर प्रहार करना", "प्रकृति का चित्रण", "व्यक्तिगत स्वार्थ", "ऐतिहासिक तथ्यों का वर्णन"]],
                ["इस अध्याय ('" + chapterName + "') में निहित मुख्य संघर्ष कौन सा है?", ["नैतिकता और अनैतिकता के बीच", "अमीर और गरीब के बीच", "भाषा और व्याकरण के बीच", "उपरोक्त सभी"]],
                ["'" + chapterName + "' की भाषा शैली के बारे में क्या कहा जा सकता है?", ["विषयानुकूल और प्रभावी", "अत्यधिक कठिन", "स्थानीय बोलियों का अभाव", "अस्पष्ट"]],
                ["लेखक ने '" + chapterName + "' के माध्यम से समाज को क्या संदेश दिया है?", ["मानवीय मूल्यों का संरक्षण", "आर्थिक प्रगति", "सिर्फ मनोरंजन", "अंधविश्वास को बढ़ावा"]],
                ["अध्याय '" + chapterName + "' में लेखक ने किन पात्रों के माध्यम से कहानी को आगे बढ़ाया है?", ["यथार्थवादी पात्रों द्वारा", "काल्पनिक पात्रों द्वारा", "विदेशी पात्रों द्वारा", "इनमें से कोई नहीं"]],
                ["'" + chapterName + "' की विषय-वस्तु आधुनिक युग में कितनी प्रासंगिक है?", ["अत्यंत प्रासंगिक", "अप्रासंगिक", "सिर्फ ऐतिहासिक दृष्टि से महत्वपूर्ण", "कह नहीं सकते"]],
                ["रचनात्मक दृष्टि से '" + chapterName + "' का क्या महत्व है?", ["शिल्प और कला का संगम", "सिर्फ शब्दों का समूह", "साधारण लेख", "एक अनुवाद मात्र"]],
                ["लेखक की लेखनी में '" + chapterName + "' किस प्रकार का परिवर्तन दर्शाती है?", ["वैचारिक परिपक्वता", "पुराने विचारों का दोहराव", "शब्दावली की कमी", "उदास भाव"]],
                ["'" + chapterName + "' को पढ़ने के बाद पाठक के मन में कौन सा मुख्य भाव उत्पन्न होता है?", ["जिज्ञासा और प्रेरणा", "भय", "क्रोध", "आलस्य"]],
                ["ग्रेेड " + grade + " के स्तर पर '" + chapterName + "' का अध्ययन क्यों आवश्यक है?", ["नैतिक और बौद्धिक विकास के लिए", "सिर्फ परीक्षा के लिए", "समय बिताने के लिए", "अनिवार्य होने के कारण"]]
            ];
        } else if (subject === "Telugu") {
            templates = [
                ["'" + chapterName + "' పాఠం ద్వారా కవి పాఠకులకు ఇచ్చే ప్రాథమిక సందేశం ఏమిటి?", ["నైతిక విలువలు మరియు సామాజిక స్పృహ", "కేవలం ప్రకృతి వర్ణన", "ధన సంపాదన", "కాలక్షేపం"]],
                ["ఈ పాఠ్యాంశం ('" + chapterName + "') లో ప్రస్తావించిన ప్రధాన సమస్య ఏది?", ["మానవ సంబంధాలలో మార్పులు", "ఆర్థిక అసమానతలు", "భాషా సమస్యలు", "పైవన్నీ"]],
                ["'" + chapterName + "' లోని పాత్రల చిత్రణ ఏ విధంగా ఉంది?", ["సహజం మరియు ప్రేరణాత్మకం", "అవాస్తవికం", "కేవలం కల్పితం", "గందరగోళం"]],
                ["ఈ పాఠం ('" + chapterName + "') చదివినప్పుడు కలిగే ప్రధాన రసం ఏది?", ["కరుణ లేదా వీర రసం", "హాస్యం", "భయం", "బీభత్సం"]],
                ["'" + chapterName + "' లోని భాషా ప్రయోగం దేనిని ప్రతిబింబిస్తుంది?", ["తెలుగు భాషా మాధుర్యం మరియు సంస్కృతి", "విదేశీ సంస్కృతి", "ప్రాంతీయ విభేదాలు", "అవగాహన లేమి"]],
                ["సందర్భోచితంగా '" + chapterName + "' లోని ప్రధాన అంశం ఏమిటి?", ["అంతర్లీన తాత్వికత", "కేవలం కథనం", "చారిత్రక ఆధారాలు లేవు", "వ్యాకరణం మాత్రమే"]],
                ["'" + chapterName + "' పాఠ్యభాగ రచయిత/కవి యొక్క శైలి ఎలా ఉంటుంది?", ["స్పష్టమైన మరియు విశ్లేషణాత్మకత", "చాలా క్లిష్టంగా", "భాషా దోషాలతో", "సాధారణం"]],
                ["నేటి సమాజ పరిస్థితులకు '" + chapterName + "' ఎలా సరిపోతుంది?", ["జీవన దృక్పథాన్ని మార్చగల శక్తి కలిగి ఉంది", "అసలు సంబంధం లేదు", "ప్రాచీన కాలానికి పరిమితం", "మార్పు అవసరం"]],
                ["'" + chapterName + "' నుండి మనం నేర్చుకోవలసిన ముఖ్యమైన గుణపాఠం ఏమిటి?", ["ప్రశ్నించే తత్వం మరియు సామాజిక బాధ్యత", "దాసరి తత్వం", "స్వార్థం", "మౌనం"]],
                ["గ్రేడ్ " + grade + " స్థాయికి '" + chapterName + "' వంటి పాఠాలు ఎలా ఉపయోగపడతాయి?", ["వ్యక్తిత్వ వికాసానికి తోడ్పడతాయి", "కేవలం మార్కుల కోసం", "అనవసర భారం", "ఏమీ లేదు"]]
            ];
        } else if (subject === "Science") {
            const cn = chapterName.toLowerCase();
            if (cn.includes("crop") || cn.includes("microorganism") || cn.includes("food")) {
                templates = [
                    ["Kharif crops are sown in which season?", ["Rainy (June-Sept)", "Winter (Oct-March)", "Summer (Mar-Jun)", "All year"]],
                    ["Which practice helps in nitrogen fixation in soil?", ["Growing leguminous crops", "Adding pesticides", "Deep ploughing only", "Burning stubble"]],
                    ["Rhizobium bacteria are found in:", ["Root nodules of legumes", "Leaves of ferns", "Soil surface only", "River water"]],
                    ["Pasteurization of milk involves heating at:", ["70 deg C for 15-30 seconds", "100 deg C for 1 minute", "40 deg C for 10 minutes", "200 deg C for 5 seconds"]],
                    ["Which microorganism is used in baking bread?", ["Yeast", "Lactobacillus", "Rhizobium", "Algae"]],
                    ["Antibiotics were first discovered by:", ["Alexander Fleming", "Louis Pasteur", "Edward Jenner", "Robert Hooke"]],
                    ["Vaccine for smallpox was developed by:", ["Edward Jenner", "Louis Pasteur", "Alexander Fleming", "Robert Koch"]],
                    ["Which is NOT a method of food preservation?", ["Ploughing", "Salting", "Deep freezing", "Pasteurization"]],
                    ["Drip irrigation is best for:", ["Water-scarce regions", "Flooded areas", "Heavy rainfall zones", "Underwater crops"]],
                    ["Which of these is a Rabi crop?", ["Wheat", "Paddy", "Maize", "Soybean"]]
                ];
            } else if (cn.includes("fibre") || cn.includes("plastic") || cn.includes("metal") || cn.includes("coal") || cn.includes("combustion")) {
                templates = [
                    ["The first fully synthetic fibre is:", ["Nylon", "Rayon", "Cotton", "Silk"]],
                    ["Thermoplastics can be:", ["Remoulded on heating", "Never reshaped", "Only used once", "Made from natural fibres"]],
                    ["Rayon is made from:", ["Wood pulp", "Petroleum", "Coal tar", "Animal hair"]],
                    ["Which metal is liquid at room temperature?", ["Mercury", "Iron", "Copper", "Aluminium"]],
                    ["Coal is formed by the process of:", ["Carbonisation", "Pasteurization", "Fermentation", "Crystallisation"]],
                    ["Petroleum is also known as:", ["Black Gold", "White Gold", "Liquid Silver", "Yellow Metal"]],
                    ["CNG stands for:", ["Compressed Natural Gas", "Carbon Nitrogen Gas", "Chemical Natural Gas", "Crude Natural Gas"]],
                    ["The zone of a candle flame that is hottest is:", ["Outermost (non-luminous)", "Middle (luminous)", "Innermost (dark)", "All are equal"]],
                    ["Calorific value measures:", ["Heat produced by 1 kg of fuel", "Weight of fuel", "Volume of fuel", "Color of flame"]],
                    ["5R principle stands for:", ["Reduce, Reuse, Recycle, Recover, Refuse", "Read, Run, Rest, Repeat, Review", "Reduce only", "Recycle only"]]
                ];
            } else if (cn.includes("cell") || cn.includes("reproduction") || cn.includes("adolescence") || cn.includes("tissue") || cn.includes("diversity")) {
                templates = [
                    ["The basic structural and functional unit of life is:", ["Cell", "Tissue", "Organ", "Atom"]],
                    ["Who discovered cells?", ["Robert Hooke", "Louis Pasteur", "Galileo", "Newton"]],
                    ["Plant cells have but animal cells lack:", ["Cell wall", "Cell membrane", "Nucleus", "Cytoplasm"]],
                    ["Prokaryotic cells lack a:", ["Well-defined nucleus", "Cell membrane", "Cytoplasm", "Ribosomes"]],
                    ["Fertilization that occurs inside the body is called:", ["Internal fertilization", "External fertilization", "Budding", "Binary fission"]],
                    ["Amoeba reproduces by:", ["Binary fission", "Budding", "Fragmentation", "Spore formation"]],
                    ["Sex of a child is determined by chromosomes from:", ["Father", "Mother", "Both equally", "Neither"]],
                    ["XX chromosomes determine:", ["Female", "Male", "Both", "Neither"]],
                    ["The master gland of the endocrine system is:", ["Pituitary gland", "Thyroid", "Adrenal", "Pancreas"]],
                    ["Metamorphosis is seen in:", ["Frog", "Dog", "Cow", "Human"]]
                ];
            } else if (cn.includes("force") || cn.includes("friction") || cn.includes("sound") || cn.includes("light") || cn.includes("pressure")) {
                templates = [
                    ["Pressure is defined as:", ["Force per unit area", "Force times area", "Mass times velocity", "Weight times height"]],
                    ["SI unit of pressure is:", ["Pascal (Pa)", "Newton (N)", "Joule (J)", "Watt (W)"]],
                    ["Which type of friction is the largest?", ["Static friction", "Sliding friction", "Rolling friction", "Fluid friction"]],
                    ["Sound cannot travel through:", ["Vacuum", "Solids", "Liquids", "Gases"]],
                    ["Frequency of sound is measured in:", ["Hertz (Hz)", "Decibel (dB)", "Newton (N)", "Meter (m)"]],
                    ["The human audible range is:", ["20 Hz to 20,000 Hz", "0 to 50 Hz", "20,000 to 50,000 Hz", "100 to 500 Hz"]],
                    ["Angle of incidence equals angle of:", ["Reflection", "Refraction", "Diffraction", "Dispersion"]],
                    ["Lateral inversion is seen in:", ["Plane mirror image", "Concave lens", "Convex lens", "Magnifying glass"]],
                    ["Streamlined shapes are designed to reduce:", ["Fluid friction (drag)", "Static friction", "Weight", "Pressure"]],
                    ["Atmospheric pressure is caused by:", ["Weight of air column above us", "Earth's rotation", "Sunlight", "Wind"]]
                ];
            } else if (cn.includes("matter") || cn.includes("atom") || cn.includes("chemical") || cn.includes("acid") || cn.includes("reaction")) {
                templates = [
                    ["The smallest particle of an element is:", ["Atom", "Molecule", "Ion", "Electron"]],
                    ["pH value of a neutral solution is:", ["7", "0", "14", "1"]],
                    ["In a chemical reaction, the total mass of reactants equals:", ["Total mass of products", "Zero", "Twice the products", "Half the products"]],
                    ["Electroplating uses:", ["Electric current", "Magnetic force", "Gravitational force", "Nuclear energy"]],
                    ["An electrolyte is a liquid that:", ["Conducts electricity", "Does not conduct", "Produces light", "Absorbs heat"]],
                    ["Chromium plating on car parts provides:", ["Shiny, rust-proof surface", "Color", "Weight", "Magnetism"]],
                    ["Pure distilled water is:", ["A poor conductor of electricity", "A good conductor", "An insulator only", "Both acid and base"]],
                    ["Chemical effects of electric current include:", ["Gas bubbles and metal deposit", "Only heat", "Only light", "No change"]],
                    ["LED stands for:", ["Light Emitting Diode", "Light Energy Device", "Low Electric Device", "Limited Emission Diode"]],
                    ["Tin plating on food containers is used because tin is:", ["Non-toxic", "Magnetic", "Radioactive", "Very heavy"]]
                ];
            } else if (cn.includes("star") || cn.includes("solar") || cn.includes("pollution") || cn.includes("natural") || cn.includes("resource") || cn.includes("earthquake")) {
                templates = [
                    ["A light year is a unit of:", ["Distance", "Time", "Speed", "Mass"]],
                    ["The Pole Star appears stationary because it is:", ["Above Earth's axis of rotation", "Inside our galaxy", "Very close to Earth", "It doesn't move at all"]],
                    ["Asteroids are found between:", ["Mars and Jupiter", "Earth and Mars", "Jupiter and Saturn", "Venus and Earth"]],
                    ["Lightning is caused by:", ["Electric discharge", "Magnetic force", "Gravitational pull", "Wind"]],
                    ["The Richter scale measures:", ["Earthquake magnitude", "Temperature", "Rainfall", "Wind speed"]],
                    ["An earthquake-proof building should have:", ["Light and flexible structure", "Very heavy roof", "All glass walls", "No foundation"]],
                    ["Greenhouse effect leads to:", ["Global warming", "Global cooling", "Ozone creation", "Acid rain only"]],
                    ["CFC damages the:", ["Ozone layer", "Troposphere", "Lithosphere", "Hydrosphere"]],
                    ["Potable water means water that is:", ["Safe for drinking", "Salty", "Industrial grade", "Distilled only"]],
                    ["Ganga Action Plan was launched in:", ["1985", "2000", "1950", "2010"]]
                ];
            } else if (cn.includes("heredity") || cn.includes("evolution") || cn.includes("improvement") || cn.includes("work") || cn.includes("energy") || cn.includes("gravitation")) {
                templates = [
                    ["The SI unit of work is:", ["Joule", "Newton", "Watt", "Pascal"]],
                    ["Work = Force * :", ["Displacement", "Time", "Velocity", "Mass"]],
                    ["Kinetic energy of a body depends on:", ["Mass and velocity", "Mass only", "Velocity only", "Height"]],
                    ["Potential energy = m * g * :", ["h (height)", "v (velocity)", "t (time)", "a (acceleration)"]],
                    ["Power is defined as:", ["Work done per unit time", "Force per unit time", "Energy per mass", "Velocity per time"]],
                    ["1 kWh equals:", ["3.6 * 10^6 Joules", "1000 Joules", "100 Joules", "360 Joules"]],
                    ["The gravitational constant G is:", ["6.674 * 10^-11 Nm^2/kg^2", "9.8 m/s^2", "3 * 10^8 m/s", "1.6 * 10^-19 C"]],
                    ["According to conservation of energy:", ["Energy can neither be created nor destroyed", "Energy is always lost", "Energy increases over time", "Energy can be created"]],
                    ["Sound above 20,000 Hz is called:", ["Ultrasonic", "Infrasonic", "Audible", "Subsonic"]],
                    ["Speed of sound in air at room temperature is approximately:", ["340 m/s", "3 * 10^8 m/s", "1500 m/s", "100 m/s"]]
                ];
            } else {
                templates = [
                    ["The correct scientific method starts with:", ["Observation", "Conclusion", "Publication", "Ignoring evidence"]],
                    ["A hypothesis is:", ["A testable prediction", "A proven fact", "A wild guess", "An opinion"]],
                    ["The SI system is used for:", ["Standard measurement worldwide", "Only in India", "Only in labs", "Cooking only"]],
                    ["Which is a physical change?", ["Melting of ice", "Burning of paper", "Rusting of iron", "Cooking food"]],
                    ["Which is a chemical change?", ["Rusting of iron", "Breaking glass", "Melting ice", "Tearing paper"]],
                    ["The process of converting liquid to gas is:", ["Evaporation", "Condensation", "Sublimation", "Freezing"]],
                    ["Which state of matter has definite shape and volume?", ["Solid", "Liquid", "Gas", "Plasma"]],
                    ["Why is carbon dioxide called a greenhouse gas?", ["It traps heat in the atmosphere", "It cools the Earth", "It creates oxygen", "It produces rain"]],
                    ["Review the core principles of '" + chapterName + "' for Grade " + grade + ".", ["Focus on definitions and key experiments", "Memorize without understanding", "Skip the chapter", "Read only the summary"]],
                    ["Which skill is essential for studying Science?", ["Critical thinking and observation", "Only memorization", "Speed reading", "None of the above"]]
                ];
            }
        } else {
            templates = [
                ["Evaluate the theoretical context of '" + chapterName + "' for Grade " + grade + " " + subject + ".", ["Apply the core principles with relevant examples.", "Ignore all foundational concepts.", "Reset the assumptions entirely.", "None of the above."]],
                ["Which concept from '" + chapterName + "' is most fundamental to understanding " + subject + "?", ["The primary definition and its direct applications.", "An unrelated mathematical formula.", "A concept from a different subject.", "None - all are equally irrelevant."]],
                ["How does '" + chapterName + "' contribute to overall " + subject + " knowledge at Grade " + grade + "?", ["It builds foundational understanding for advanced topics.", "It has no connection to other chapters.", "It contradicts other chapters.", "It is purely theoretical."]],
                ["What is the best way to prepare for '" + chapterName + "' in " + subject + "?", ["Practice problems and understand concepts deeply.", "Memorize without comprehension.", "Skip the chapter entirely.", "Only read the first paragraph."]],
                ["If a question from '" + chapterName + "' appears in the exam, the best strategy is:", ["Apply learned concepts step by step.", "Guess randomly.", "Leave it blank.", "Copy from a neighbor."]],
                ["The key takeaway from '" + chapterName + "' is:", ["Understanding core principles for real-world applications.", "Unnecessary information.", "Only formulas with no context.", "Nothing useful."]],
                ["Which study method is most effective for '" + chapterName + "'?", ["Active recall and spaced repetition.", "Reading once and forgetting.", "Only highlighting text.", "Watching unrelated videos."]],
                ["In the context of '" + chapterName + "', which statement reflects critical thinking?", ["Questioning assumptions and verifying with evidence.", "Accepting everything without proof.", "Ignoring contradicting data.", "Following only popular opinion."]],
                ["Why is '" + chapterName + "' included in the Grade " + grade + " " + subject + " curriculum?", ["It develops essential analytical and conceptual skills.", "It is a filler chapter.", "It has no educational purpose.", "It was added by mistake."]],
                ["How can the concepts in '" + chapterName + "' be applied in daily life?", ["Through practical observation and problem-solving.", "They cannot be applied at all.", "Only in a laboratory.", "Only during exams."]]
            ];
        }

        // 1. Manually build base question objects from templates
        const baseQuestions = [];
        
        // Add formula questions first
        for (const fq of formulaQuestions) {
            baseQuestions.push({
                text: String(fq.text || 'Question'),
                options: Array.isArray(fq.options) ? fq.options.map(o => String(o || '')) : [],
                correct: String(fq.correct || '')
            });
        }
        
        // Add templates up to 10 total
        for (const t of templates) {
            if (baseQuestions.length >= 10) break;
            const qText = String(t[0] || 'Question');
            const qOpts = Array.isArray(t[1]) ? t[1].map(o => String(o || '')) : [];
            if (qOpts.length >= 4) {
                baseQuestions.push({
                    text: qText,
                    options: qOpts,
                    correct: String(qOpts[0] || '')
                });
            }
        }

        // 2. Map to final format with explicit shuffle
        return baseQuestions.map(item => {
            const list = [...item.options];
            // Fisher-Yates shuffle
            for (let i = list.length - 1; i > 0; i--) {
                const j = Math.floor(random() * (i + 1));
                const temp = list[i];
                list[i] = list[j];
                list[j] = temp;
            }
            
            let correctIdx = list.indexOf(item.correct);
            if (correctIdx === -1) correctIdx = 0;

            return {
                id: 'gen-' + Math.random().toString(36).substr(2, 9),
                text: item.text,
                options: list,
                correct: correctIdx,
                review_text: "Review the chapter '" + chapterName + "' to understand why '" + item.correct + "' is the correct answer."
            };
        });
    }
}

export default QuizProvider;
