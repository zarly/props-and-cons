ENV="${NODE_ENV:-development}"
DB_NAME=props-and-cons-$ENV
OUT_NAME=dump-`date +%Y-%m-%d`-$ENV
mongodump --db $DB_NAME --out $OUT_NAME
zip $OUT_NAME.zip $OUT_NAME -r
rm -Rf $OUT_NAME
