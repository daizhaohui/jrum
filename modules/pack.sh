cd ../build
npm pack
cp $(find . -name "jrum-builder*.tgz") ../modules
rm -r $(find . -name "jrum-builder*.tgz")
cd ../jrum
npm pack
cp $(find . -name "jrum*.tgz") ../modules
rm -r $(find . -name "jrum*.tgz")