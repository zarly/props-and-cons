ssh app@alex-abramov.com 'mongodump --db props-and-cons-production --out last-dump && zip last-dump.zip last-dump -r'
scp app@alex-abramov.com:/apps/last-dump.zip last-dump.zip
rm -Rf last-dump
unzip -o last-dump.zip && rm last-dump.zip
