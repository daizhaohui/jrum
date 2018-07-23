cd ../build
npm pack
cp $(find . -name "jrum-build*.tgz") ../modules
rm -r $(find . -name "jrum-build*.tgz")
cd ../jrum
npm pack
cp $(find . -name "jrum*.tgz") ../modules
rm -r $(find . -name "jrum*.tgz")