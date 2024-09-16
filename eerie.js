// Initialize Chart.js
let myChart;

// Array to store data for each page
const pages = [
    {
        title: 'October 24',
        subtitle: 'Earnings',
        chartType: 'line',
        chartData: {
            labels: ['A', 'B', 'C'],
            datasets: [{
                label: 'Aug-Oct ($M)',
                data: [21, 20, 22.5],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)']
            }]
        },
        tableContent: {
            headers: ['Name', 'Hello!', '$'],
            rows: [
                ['Aug', 'please', '21m'],
                ['Sep', 'help', '20m'],
                ['Oct', 'me', '22.5']
            ]
        }
    },
    {
        title: 'Employee Overview',
        subtitle: 'Headcount',
        chartType: 'bar',
        chartData: {
            labels: ['Ongoing', 'Temp', 'Died Under Mysterious Circumstances'],
            datasets: [{
                label: 'Employees',
                data: [81, 12, 1],
                backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(199, 36, 36, 1)']
            }]
        },
        tableContent: {
            headers: ['Type', 'Count'],
            rows: [
                ['Ongoing', '81'],
                ['Temp', '12'],
                ['Died Under Mysterious Circumstances', '1']
            ]
        } 
    },
    {
        title: 'Sales by Region',
        subtitle: 'Q4 Overview',
        chartType: 'bubble',
        chartData: {
            datasets: [{
                label: 'Sales by Region',
                data: [
                    { x: 'North America', y: 120000, r: 20 },
                    { x: 'Asia', y: 150000, r: 25 },
                    { x: 'Australia', y: 60000, r: 10 }
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 205, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 205, 86, 1)'
                ]
            }]
        },
        tableContent: {
            headers: ['Region', 'Sales', 'Share'],
            rows: [
                ['North America', '$120,000', '28.6%'],
                ['Asia', '$150,000', '35.7%'],
                ['Australia', '$60,000', '14.3%']
            ]
        }
    },
];

// Track current page index
let currentPageIndex = 0;

// Function to load the current page content
function loadPage(pageIndex) {
    const page = pages[pageIndex];

    // Update title and subtitle
    document.getElementById('page-title').textContent = page.title;
    document.getElementById('subtitle').textContent = page.subtitle;

    // Update table content
    const tableText = document.getElementById('table-text');
    const tableContent = page.tableContent;
    let tableHTML = '<table><thead><tr>';
    tableContent.headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    tableContent.rows.forEach(row => {
        tableHTML += '<tr>';
        row.forEach(cell => {
            tableHTML += `<td>${cell}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    tableText.innerHTML = tableHTML;

    // Destroy the old chart if it exists
    if (myChart) {
        myChart.destroy();
    }

    // Create a new chart configuration
    let chartConfig = {
        type: page.chartType,
        data: page.chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    };

    if (page.chartType === 'bar') {
        chartConfig = {
            type: 'bar',
            data: {
                labels: page.chartData.labels,
                datasets: [{
                    label: page.chartData.datasets[0].label,
                    data: page.chartData.datasets[0].data.map((value, index) => 
                        index === 2 ? 100 : value  // Make the third bar (index 2) much larger
                    ),
                    backgroundColor: page.chartData.datasets[0].backgroundColor,
                    borderColor: 'rgba(0, 0, 0, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100  // Set the max value to 100
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart',
                    onComplete: function(animation) {
                        const chartInstance = animation.chart;
                        const ctx = chartInstance.ctx;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.font = 'bold 14px Arial';
                        ctx.fillStyle = 'red';
    
                        this.data.datasets.forEach(function (dataset, datasetIndex) {
                            const meta = chartInstance.getDatasetMeta(datasetIndex);
                            meta.data.forEach(function (bar, index) {
                                if (index === 2) {  // Only for the third bar
                                    const data = dataset.data[index];
                                    ctx.fillText('!!!', bar.x, bar.y - 5);
                                }
                            });
                        });
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.dataIndex === 2) {
                                    return '1. Me and I need your help';
                                }
                                return context.formattedValue;
                            }
                        }
                    }
                }
            }
        };
    }

    // Special configuration for bubble chart with haunted effect
if (page.chartType === 'bubble') {
    const bubbleData = page.chartData.datasets[0].data;
    chartConfig = {
        type: 'bubble',
        data: {
            datasets: [{
                label: page.chartData.datasets[0].label,
                data: bubbleData.map((item, index) => ({
                    x: index,
                    y: item.y,
                    r: item.r
                })),
                backgroundColor: page.chartData.datasets[0].backgroundColor.map(color => color.replace('0.2', '0.6')),
                borderColor: page.chartData.datasets[0].borderColor,
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    labels: bubbleData.map(item => item.x),
                    title: {
                        display: true,
                        text: 'Region',
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Sales',
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw.x}: $${context.raw.y.toLocaleString()} (${context.raw.r}% market share)`;
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    };

    // Add CSS for haunted effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes hauntedShake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        #myChart {
            animation: hauntedShake 0.5s infinite;
            filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.5));
        }
        #chart-wrapper {
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        }
    `;
    document.head.appendChild(style);

    // Ghostly bubble pulsing
    setInterval(() => {
        chartConfig.data.datasets[0].data = chartConfig.data.datasets[0].data.map(bubble => ({
            ...bubble,
            r: bubble.r + Math.sin(Date.now() / 200) * 2
        }));
        myChart.update();
    }, 50);
}

function adjustLayout() {
    const container = document.getElementById('container');
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const aspectRatio = 3 / 2;

    let containerHeight, containerWidth;

    if (windowWidth / windowHeight > aspectRatio) {
        // Window is wider than desired aspect ratio
        containerHeight = windowHeight;
        containerWidth = containerHeight * aspectRatio;
    } else {
        // Window is taller than desired aspect ratio
        containerWidth = windowWidth;
        containerHeight = containerWidth / aspectRatio;
    }

    container.style.width = `${containerWidth}px`;
    container.style.height = `${containerHeight}px`;

    // Adjust font sizes
    const baseFontSize = containerHeight * 0.02; // 2% of container height
    document.documentElement.style.fontSize = `${baseFontSize}px`;

    // Adjust chart size
    const chartContainer = document.getElementById('myChart').parentElement;
    chartContainer.style.height = `${containerHeight * 0.3}px`; // 30% of container height

    // Reload the current page to redraw the chart with new dimensions
    loadPage(currentPageIndex);
}

    // Create a new chart
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, chartConfig);
}

// Function to handle next page navigation
function goToNextPage() {
    if (currentPageIndex < pages.length - 1) {
        currentPageIndex++;
        loadPage(currentPageIndex);
    }
}

// Function to handle back page navigation
function goToPreviousPage() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        loadPage(currentPageIndex);
    }
}

// Function to handle touch/pointer events
function handleSwipe(startX, endX) {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistance = startX - endX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            goToNextPage();
        } else {
            goToPreviousPage();
        }
    }
}

// Variables to track touch/pointer events
let startX;

// Add event listeners for both touch and pointer events
function addEventListeners() {
    const chartContainer = document.getElementById('myChart').parentElement;

    // Pointer events (works for both touch and mouse)
    chartContainer.addEventListener('pointerdown', (e) => {
        startX = e.clientX;
    });

    chartContainer.addEventListener('pointerup', (e) => {
        if (startX !== undefined) {
            handleSwipe(startX, e.clientX);
            startX = undefined;
        }
    });

    // Fallback touch events for older devices
    chartContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    chartContainer.addEventListener('touchend', (e) => {
        if (startX !== undefined) {
            handleSwipe(startX, e.changedTouches[0].clientX);
            startX = undefined;
        }
    });

    // Prevent default touch behavior to avoid scrolling while swiping
    chartContainer.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    // Existing button click listeners
    document.getElementById('next-button').addEventListener('click', goToNextPage);
    document.getElementById('back-button').addEventListener('click', goToPreviousPage);
}

// Initial page load and event listener setup
loadPage(currentPageIndex);
addEventListeners();

// Add a resize event listener to handle orientation changes
window.addEventListener('resize', () => {
    loadPage(currentPageIndex);
});

// Call adjustLayout on initial load and resize
window.addEventListener('load', adjustLayout);
window.addEventListener('resize', adjustLayout);

// Replace the existing resize event listener
window.removeEventListener('resize', loadPage);
window.addEventListener('resize', adjustLayout);