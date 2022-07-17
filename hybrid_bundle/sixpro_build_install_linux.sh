# Automatic producing installer for linux 

# GIT, node, npm, yarn, ms visual studio 2019 should be installed with C++ support
# This script should run under visual studio x86_64 terminal 
# First clone git
cd 
rm -rfv  bookiepro
git clone --recursive -b installers-for-all-platforms-1 https://gitlab.com/PBSA/bookie/bookiepro.git
cd bookiepro
yarn
# call yarn add shx
yarn add shx --location=global
yarn build
mv -v build www

# cd \bookiepro
cd ~/bookiepro/hybrid_bundle
mkdir build_linux_631_release
cd build_linux_631_release


~/Qt/6.3.1/gcc_64/bin/qmake ~/bookiepro/hybrid_bundle/sixpro_app/sixpro_app.pro -spec linux-g++ "CONFIG+=qtquickcompiler"


make -f C:/bookiepro/hybrid_bundle/build_linux_631_release/Makefile qmake_all

make -j2 


cd ~/bookiepro/hybrid_bundle
mkdir deploy_linux_631_release
cd deploy_linux_631_release
cqtdeployer -bin ~/bookiepro/hybrid_bundle/build_linux_631_release/release/sixpro_app  -qmake  ~/Qt/6.3.1/gcc_64/bin/qmake

cp -v ~/bookiepro/hybrid_bundle/build_linux_631_release/release/sixpro_app .
cp -v ~/bookiepro/hybrid_bundle/sixpro_app/sixpro_logo* .

cp -rfv ~/bookiepro/www  ~/bookiepro/hybrid_bundle/deploy_linux_631_release/www  

# NOW LETS MAKE INSTALLER :)

cp -rfv ~/bookiepro/hybrid_bundle/deploy_linux_631_release  ~/bookiepro/hybrid_bundle/SixPRO_INSTALLER_LINUX/packages/com.peerplays.sixpro/data  

cd ~/bookiepro/hybrid_bundle/SixPRO_INSTALLER_LINUX

sixpro_installer_linux.sh




