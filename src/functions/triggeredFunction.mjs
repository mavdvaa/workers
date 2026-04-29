export function isSimple(i) {
        if (i < 2) return false;
        if (i == 2 || i == 3) return true;
        if (i % 2 == 0 || i % 3 == 0) return false;
        for (let j = 5; j ** 2 <= i; j += 6) {
            if (i % j == 0 || i % (j + 2) == 0) return false;
        }
        return true;
    }